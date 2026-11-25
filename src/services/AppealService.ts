import { Op, Transaction, WhereAttributeHash } from "sequelize";
import { ListQuery, activeWhere } from "../utils/ActiveFilter";
import db from "../database/models/database";
import { AppealModel, CTDOPModel, PenaltyDocModel, ProtocolModel } from "../database/models";
import AppealInterface from "../database/interfaces/AppealInterface";
import { CtdopTypeEnum } from "../database/models/enums/CtdopTypeEnum";
import { PenaltyStatusEnum } from "../database/models/enums/PenaltyStatusEnum";
import { AppealResponseEnum } from "../database/models/enums/AppealResponseEnum";
import Response from "../utils/Response";
import { isUniqueViolation, uniqueConflict } from "../utils/conflict";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

/** Status do documento conforme o recurso: com resposta, a própria resposta; sem ela, RECORRIDO. */
const statusFor = (response?: AppealResponseEnum | null) =>
  (response as unknown as PenaltyStatusEnum) ?? PenaltyStatusEnum.RECORRIDO;

const fullInclude = [
  { model: ProtocolModel, as: "Protocol", required: false },
  { model: CTDOPModel, as: "ResponseCTDOP", required: false },
  { model: PenaltyDocModel, as: "PenaltyDoc", required: false },
];

class AppealService {
  private model = AppealModel;

  /** O documento precisa estar ativo e ser do mesmo tipo do protocolo ativo. */
  private async checkProtocolAndDoc(fkProtocolId: string, fkPenaltyDocId: string) {
    const protocol = await ProtocolModel.findOne({ where: { protocolId: fkProtocolId, activated: true } });
    if (!protocol) return Response.badRequest("Protocolo não encontrado ou inativo.");
    const doc = await PenaltyDocModel.findOne({ where: { penaltyDocId: fkPenaltyDocId, activated: true } });
    if (!doc) return Response.badRequest("Documento de penalidade não encontrado ou inativo.");
    if (doc.penaltyDocType !== protocol.protocolType) {
      return Response.badRequest(`O protocolo é de ${protocol.protocolType}; o documento é ${doc.penaltyDocType}.`);
    }
    return null;
  }

  /** Resposta exige a CTDOP de resposta (ativa, do tipo RESPOSTA DE RECURSO). */
  private async checkResponse(response?: AppealResponseEnum | null, fkResponseCtdopId?: string | null) {
    if (response && !fkResponseCtdopId) return Response.badRequest("Informe a CTDOP de resposta junto com a resposta.");
    if (!fkResponseCtdopId) return null;
    const ctdop = await CTDOPModel.findOne({ where: { ctdopId: fkResponseCtdopId, activated: true } });
    if (!ctdop) return Response.badRequest("CTDOP de resposta não encontrada ou inativa.");
    if (ctdop.docType !== CtdopTypeEnum.RESPOSTA) {
      return Response.badRequest(`A CTDOP de resposta precisa ser do tipo ${CtdopTypeEnum.RESPOSTA}.`);
    }
    return null;
  }

  private setDocStatus(penaltyDocId: string, status: PenaltyStatusEnum, updatedBy: string, transaction: Transaction) {
    return PenaltyDocModel.update(
      { penaltyDocStatus: status, updatedBy, updatedAt: new Date() },
      { where: { penaltyDocId }, transaction }
    );
  }

  /** Grava a mudança e o status do documento na mesma transação. */
  private async withDocStatus(penaltyDocId: string, status: PenaltyStatusEnum, user: string, write: (t: Transaction) => Promise<unknown>) {
    const transaction = await db.transaction();
    try {
      await write(transaction);
      await this.setDocStatus(penaltyDocId, status, user, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   * Cria o recurso de um documento (um por documento) e põe o documento em RECORRIDO,
   * ou na resposta, se ela já vier informada.
   */
  async createAppeal(data: AppealInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.AppealValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const existing = await this.model.findOne({ where: { fkPenaltyDocId: data.fkPenaltyDocId } });
    if (existing) return uniqueConflict("Recurso deste documento", existing, existing.appealId, 'appeal');

    const invalid = await this.checkProtocolAndDoc(data.fkProtocolId, data.fkPenaltyDocId)
      ?? await this.checkResponse(data.response, data.fkResponseCtdopId);
    if (invalid) return invalid;

    let appealId = '';
    try {
      await this.withDocStatus(data.fkPenaltyDocId, statusFor(data.response), data.createdBy, async (transaction) => {
        appealId = (await this.model.create({ ...data }, { transaction })).appealId;
      });
    } catch (err) {
      if (isUniqueViolation(err)) return Response.conflict("Recurso deste documento já cadastrado(a).");
      throw err;
    }
    return Response.created("Recurso criado com sucesso!", { appealId });
  }

  /**
   * Atualiza protocolo e resposta. Gravar a resposta põe o documento em DEFERIDO/INDEFERIDO;
   * limpá-la (`response: null`) volta o documento a RECORRIDO.
   */
  async updateAppeal(id: string, data: Partial<AppealInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateAppealValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const record = await this.model.findOne({ where: { appealId: id, activated: true } });
    if (!record) return Response.notFound("Recurso não encontrado!");

    const response = data.response !== undefined ? data.response : record.response;
    const fkResponseCtdopId = data.fkResponseCtdopId !== undefined ? data.fkResponseCtdopId : record.fkResponseCtdopId;

    const invalid = (data.fkProtocolId ? await this.checkProtocolAndDoc(data.fkProtocolId, record.fkPenaltyDocId) : null)
      ?? await this.checkResponse(response, fkResponseCtdopId);
    if (invalid) return invalid;

    await this.withDocStatus(record.fkPenaltyDocId, statusFor(response), data.updatedBy as string, (transaction) =>
      this.model.update(data, { where: { appealId: id, activated: true }, transaction }));

    const result = await this.model.findOne({ where: { appealId: id, activated: true }, include: fullInclude });
    return Response.ok("Recurso atualizado com sucesso!", result);
  }

  /**
   * Desativa o recurso (exclusão lógica) e volta o documento a EM ANÁLISE.
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteAppeal(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const record = await this.model.findOne({ where: { appealId: id, activated: true } });
    if (!record) return Response.notFound("Recurso não encontrado!");

    await this.withDocStatus(record.fkPenaltyDocId, PenaltyStatusEnum.EM_ANALISE, updatedBy, (transaction) =>
      this.model.update({ activated: false, updatedBy, updatedAt: new Date() }, { where: { appealId: id }, transaction }));

    return Response.ok("Recurso desativado com sucesso!");
  }

  /**
   * Reativa o recurso e devolve ao documento o status correspondente (RECORRIDO ou a resposta).
   * Responde 409 se o documento ou o protocolo estiverem inativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateAppeal(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const record = await this.model.findOne({ where: { appealId: id, activated: false } });
    if (!record) return Response.notFound("Recurso não encontrado ou já ativo!");

    if (!(await PenaltyDocModel.count({ where: { penaltyDocId: record.fkPenaltyDocId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: o documento de penalidade está inativo.");
    }
    if (!(await ProtocolModel.count({ where: { protocolId: record.fkProtocolId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: o protocolo está inativo.");
    }

    await this.withDocStatus(record.fkPenaltyDocId, statusFor(record.response), updatedBy, (transaction) =>
      record.update({ activated: true, updatedBy, updatedAt: new Date() }, { transaction }));

    return Response.ok("Recurso reativado com sucesso!");
  }

  async getAppeal(id: string) {
    if (!id) return Response.badRequest("ID do recurso não informado.");

    const result = await this.model.findOne({ where: { appealId: id, activated: true }, include: fullInclude });
    if (!result) return Response.notFound("Recurso não encontrado!");
    return Response.ok("Recurso encontrado!", result);
  }

  async findAppeals(query: Record<string, unknown> & ListQuery) {
    const where: WhereAttributeHash = { ...activeWhere(query) };
    for (const key of ['fkProtocolId', 'fkPenaltyDocId', 'fkResponseCtdopId', 'response']) {
      if (typeof query[key] === "string" && query[key]) where[key] = query[key];
    }

    const protocolNumber = typeof query.protocolNumber === "string" ? query.protocolNumber : '';
    const include = [
      protocolNumber
        ? { model: ProtocolModel, as: "Protocol", required: true, where: { protocolNumber: { [Op.iLike]: `%${protocolNumber}%` } } }
        : fullInclude[0],
      fullInclude[1],
    ];

    const result = await this.model.findAll({ where, include });

    if (!result.length) return Response.notFound("Nenhum recurso encontrado com os filtros fornecidos.");
    return Response.ok("Recursos encontrados com sucesso", result);
  }
}

export default AppealService;
