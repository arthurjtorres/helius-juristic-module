import { randomUUID } from "crypto";
import { ListQuery, activeWhere } from "../utils/ActiveFilter";
import db from "../database/models/database";
import { AnalysisModel, AppealModel, PenaltyDocModel, PenaltyInfoModel, ProtocolModel } from "../database/models";
import PenaltyInfoInterface from "../database/interfaces/PenaltyInfoInterface";
import PenaltyDocInterface from "../database/interfaces/PenaltyDocInterface";
import { PenaltyStatusEnum } from "../database/models/enums/PenaltyStatusEnum";
import { buildPenaltyInfoView } from "./integrations/PenaltyInfoAggregator";
import { getCompanyCorporationId } from "./integrations/integrationService";
import Response from "../utils/Response";
import { isUniqueViolation } from "../utils/conflict";
import { checkCtdopForDoc, checkDocNumber, checkPenaltyParents } from "./penaltyRules";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

type PenaltyCreate = PenaltyInfoInterface & {
  doc: Omit<PenaltyDocInterface, 'fkPenaltyInfoId' | 'createdAt' | 'createdBy'>;
};

/** Documentos ativos do fato, com recurso e protocolo. */
const docsInclude = [
  { model: PenaltyDocModel, as: "PenaltyDocs", where: { activated: true }, required: false, include: [
    { model: AppealModel, as: "Appeal", where: { activated: true }, required: false, include: [
      { model: ProtocolModel, as: "Protocol", required: false },
    ]},
  ]},
];

const NO_COMPANY = "Empresa não encontrada ou inativa no cadastro.";

class PenaltyInfoService {
  private model = PenaltyInfoModel;

  /**
   * Cria o fato e o seu primeiro documento numa transação: falha em qualquer um não grava nada.
   * O consórcio vem da empresa (`registry`); a CTDOP precisa ser do tipo do documento;
   * o número do documento é único por consórcio e tipo. Autoria do token nos dois registros.
   *
   * @param data Campos do fato, com o documento em `doc`, e `createdBy` do token.
   */
  async createPenalty(data: PenaltyCreate) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.PenaltyCreateValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const { doc, ...info } = data;

    const fkCorporationId = await getCompanyCorporationId(info.fkCompanyId);
    if (!fkCorporationId) return Response.badRequest(NO_COMPANY);

    const invalid = await checkPenaltyParents(info)
      ?? await checkCtdopForDoc(doc.fkCtdopId, doc.penaltyDocType)
      ?? await checkDocNumber(fkCorporationId, doc.penaltyDocType, doc.penaltyDocNumber);
    if (invalid) return invalid;

    const penaltyInfoId = randomUUID();
    const penaltyDocId = randomUUID();
    const audit = { createdBy: info.createdBy, createdAt: info.createdAt };

    const transaction = await db.transaction();
    try {
      await this.model.create({ ...info, penaltyInfoId, fkCorporationId, ...audit }, { transaction });
      await PenaltyDocModel.create({
        ...doc,
        penaltyDocId,
        penaltyDocStatus: doc.penaltyDocStatus ?? PenaltyStatusEnum.EM_ANALISE,
        fkPenaltyInfoId: penaltyInfoId,
        fkCorporationId,
        ...audit,
      }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      if (isUniqueViolation(err)) return Response.conflict("Documento já cadastrado para este fato ou consórcio.");
      throw err;
    }

    return Response.created("Penalidade e documento criados com sucesso!", { penaltyInfoId, penaltyDocId });
  }

  /**
   * Atualiza o fato. Trocar a empresa recalcula o consórcio; o banco o propaga aos documentos
   * (`ON UPDATE CASCADE`) e recusa (409) se algum número colidir no consórcio novo.
   */
  async updatePenalty(id: string, data: Partial<PenaltyInfoInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdatePenaltyInfoValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const record = await this.model.findOne({ where: { penaltyInfoId: id, activated: true } });
    if (!record) return Response.notFound("Penalidade não encontrada!");

    const invalid = await checkPenaltyParents(data);
    if (invalid) return invalid;

    const changes: Partial<PenaltyInfoInterface> = { ...data };
    if (data.fkCompanyId && data.fkCompanyId !== record.fkCompanyId) {
      const fkCorporationId = await getCompanyCorporationId(data.fkCompanyId);
      if (!fkCorporationId) return Response.badRequest(NO_COMPANY);
      changes.fkCorporationId = fkCorporationId;
    }

    try {
      await this.model.update(changes, { where: { penaltyInfoId: id, activated: true } });
    } catch (err) {
      if (isUniqueViolation(err)) {
        return Response.conflict("Um documento deste fato já tem o mesmo número no consórcio da nova empresa.");
      }
      throw err;
    }

    const result = await this.model.findOne({ where: { penaltyInfoId: id, activated: true }, include: docsInclude });
    return Response.ok("Penalidade atualizada com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   * Bloqueia (409) se houver dependentes ativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deletePenalty(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await PenaltyDocModel.count({ where: { fkPenaltyInfoId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: a penalidade possui documentos ativos.");
    }

    if (await AnalysisModel.count({ where: { fkPenaltyInfoId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: a penalidade possui análises ativas.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { penaltyInfoId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Penalidade não encontrada!");

    return Response.ok("Penalidade desativada com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   * Responde 409 se agente, código ou motivo informados estiverem inativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivatePenalty(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const record = await this.model.findOne({ where: { penaltyInfoId: id, activated: false } });
    if (!record) return Response.notFound("Penalidade não encontrada ou já ativa!");

    const inactiveParent = await checkPenaltyParents(record);
    if (inactiveParent) return Response.conflict(`Não é possível reativar: ${inactiveParent.message}`);

    await record.update({ activated: true, updatedBy, updatedAt: new Date() });

    return Response.ok("Penalidade reativada com sucesso!");
  }

  async getPenalty(id: string) {
    const penalty = await this.model.findOne({ where: { penaltyInfoId: id, activated: true }, include: docsInclude });
    if (!penalty) return Response.notFound("Penalidade não encontrada!");

    const result = await buildPenaltyInfoView(penalty);
    return Response.ok("Penalidade encontrada!", result);
  }

  /**
   * Busca penalidades por filtros locais (igualdade), sem consultar outros módulos.
   * `penaltyDocStatus` filtra pelos documentos e traz só os fatos com documento nesse status.
   */
  async findPenalties(query: Record<string, unknown> & ListQuery) {
    const where: Record<string, unknown> = { ...activeWhere(query) };

    const filterKeys = [
      'fkCompanyId', 'fkCorporationId', 'fkVehicleId', 'fkBusTimetableId', 'fkLocationId',
      'fkAgentId', 'fkFineCodeId', 'fkMotiveId', 'date',
    ];
    for (const key of filterKeys) {
      if (typeof query[key] === "string" && query[key]) where[key] = query[key];
    }

    const include = typeof query.penaltyDocStatus === "string" && query.penaltyDocStatus
      ? [{ ...docsInclude[0], where: { activated: true, penaltyDocStatus: query.penaltyDocStatus }, required: true }]
      : docsInclude;

    const results = await this.model.findAll({ where, include });

    if (!results.length) return Response.notFound("Nenhuma penalidade encontrada com os filtros fornecidos.");
    return Response.ok("Penalidades encontradas com sucesso!", results);
  }

}

export default PenaltyInfoService;
