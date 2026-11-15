import { AppealModel, CTDOPModel, PenaltyDocModel, PenaltyInfoModel, ProtocolModel } from "../database/models";
import PenaltyDocInterface from "../database/interfaces/PenaltyDocInterface";
import { PenaltyStatusEnum } from "../database/models/enums/PenaltyStatusEnum";
import Response from "../utils/Response";
import { isUniqueViolation, uniqueConflict } from "../utils/conflict";
import { checkCtdopForDoc, checkDocNumber } from "./penaltyRules";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

const appealInclude = {
  model: AppealModel, as: "Appeal", where: { activated: true }, required: false,
  include: [{ model: ProtocolModel, as: "Protocol", required: false }],
};

class PenaltyDocService {
  private model = PenaltyDocModel;

  /**
   * Cadastra um documento num fato existente (ex.: o auto de infração da notificação).
   * O consórcio é copiado do fato. Um documento de cada tipo por fato; número único por consórcio e tipo.
   */
  async createPenaltyDoc(data: PenaltyDocInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.PenaltyDocValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const info = await PenaltyInfoModel.findOne({ where: { penaltyInfoId: data.fkPenaltyInfoId, activated: true } });
    if (!info) return Response.badRequest("Penalidade não encontrada ou inativa.");

    const sameType = await this.model.findOne({
      where: { fkPenaltyInfoId: data.fkPenaltyInfoId, penaltyDocType: data.penaltyDocType },
    });
    if (sameType) {
      return uniqueConflict(`${data.penaltyDocType} desta penalidade`, sameType, sameType.penaltyDocId, 'penalty-doc');
    }

    const invalid = await checkCtdopForDoc(data.fkCtdopId, data.penaltyDocType)
      ?? await checkDocNumber(info.fkCorporationId, data.penaltyDocType, data.penaltyDocNumber);
    if (invalid) return invalid;

    try {
      const doc = await this.model.create({
        ...data,
        penaltyDocStatus: data.penaltyDocStatus ?? PenaltyStatusEnum.EM_ANALISE,
        fkCorporationId: info.fkCorporationId,
      });
      return Response.created("Documento de penalidade criado com sucesso!", { penaltyDocId: doc.penaltyDocId });
    } catch (err) {
      if (isUniqueViolation(err)) return Response.conflict("Documento já cadastrado para este fato ou consórcio.");
      throw err;
    }
  }

  /** Atualiza número, CTDOP, status (enum) e anotação. Tipo e fato não mudam. */
  async updatePenaltyDoc(id: string, data: Partial<PenaltyDocInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdatePenaltyDocValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const record = await this.model.findOne({ where: { penaltyDocId: id, activated: true } });
    if (!record) return Response.notFound("Documento de penalidade não encontrado!");

    const invalid = (data.fkCtdopId ? await checkCtdopForDoc(data.fkCtdopId, record.penaltyDocType) : null)
      ?? (data.penaltyDocNumber
        ? await checkDocNumber(record.fkCorporationId, record.penaltyDocType, data.penaltyDocNumber, id)
        : null);
    if (invalid) return invalid;

    try {
      await this.model.update(data, { where: { penaltyDocId: id, activated: true } });
    } catch (err) {
      if (isUniqueViolation(err)) return Response.conflict("Número de documento já usado neste consórcio.");
      throw err;
    }

    const result = await this.model.findOne({ where: { penaltyDocId: id, activated: true }, include: [appealInclude] });
    return Response.ok("Documento de penalidade atualizado com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   * Bloqueia (409) se houver dependentes ativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deletePenaltyDoc(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await AppealModel.count({ where: { fkPenaltyDocId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: o documento possui recursos ativos.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { penaltyDocId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Documento de penalidade não encontrado!");

    return Response.ok("Documento de penalidade desativado com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   * Responde 409 se um registro pai estiver inativo.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivatePenaltyDoc(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const record = await this.model.findOne({ where: { penaltyDocId: id, activated: false } });
    if (!record) return Response.notFound("Documento de penalidade não encontrado ou já ativo!");

    if (!(await PenaltyInfoModel.count({ where: { penaltyInfoId: record.fkPenaltyInfoId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: a penalidade está inativa.");
    }
    if (!(await CTDOPModel.count({ where: { ctdopId: record.fkCtdopId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: o CTDOP está inativo.");
    }

    await record.update({ activated: true, updatedBy, updatedAt: new Date() });

    return Response.ok("Documento de penalidade reativado com sucesso!");
  }

  async getPenaltyDoc(id: string) {
    const result = await this.model.findOne({ where: { penaltyDocId: id, activated: true }, include: [appealInclude] });
    if (!result) return Response.notFound("Documento de penalidade não encontrado!");

    return Response.ok("Documento de penalidade encontrado!", result);
  }

  async findPenaltyDocs(query: Record<string, any>) {
    const where: any = { activated: true };
    const filterKeys = ['penaltyDocType', 'penaltyDocNumber', 'penaltyDocStatus', 'fkCtdopId', 'fkPenaltyInfoId', 'fkCorporationId'];
    for (const key of filterKeys) {
      if (typeof query[key] === "string" && query[key]) where[key] = query[key];
    }

    const result = await this.model.findAll({ where, include: [appealInclude] });

    if (!result.length) return Response.notFound("Nenhum documento de penalidade encontrado.");
    return Response.ok("Documentos de penalidade encontrados com sucesso!", result);
  }
}

export default PenaltyDocService;
