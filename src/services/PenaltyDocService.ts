import { ModelStatic } from "sequelize";
import PenaltyDocModel from "../database/models/PenaltyDocModel";
import PenaltyDocInterface from "../database/interfaces/PenaltyDocInterface";
import Response from "../utils/Response";
import { AppealModel, CTDOPModel, PenaltyInfoModel } from "../database/models";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class PenaltyDocService {
  private model: ModelStatic<PenaltyDocModel> = PenaltyDocModel;

  async createPenaltyDoc(data: PenaltyDocInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.PenaltyDocValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    await this.model.create({ ...data });
    return Response.created("Documento de penalidade criado com sucesso!");
  }

  async updatePenaltyDoc(id: string, data: Partial<PenaltyDocInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdatePenaltyDocValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, { where: { penaltyDocId: id, activated: true } });
    if (!updated) return Response.notFound("Documento de penalidade não encontrado!");

    const result = await this.model.findOne({ where: { penaltyDocId: id, activated: true } });
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
    const result = await this.model.findOne({ where: { penaltyDocId: id, activated: true } });
    if (!result) return Response.notFound("Documento de penalidade não encontrado!");

    return Response.ok("Documento de penalidade encontrado!", result);
  }

  async findPenaltyDocs(query: {
    penaltyDocType?: string;
    penaltyDocNumber?: string;
    fkCtdopId?: string;
    fkPenaltyInfoId?: string;
  }) {
    const where: any = { activated: true };

    if (query.penaltyDocType) where.penaltyDocType = query.penaltyDocType;
    if (query.penaltyDocNumber) where.penaltyDocNumber = query.penaltyDocNumber;
    if (query.fkCtdopId) where.fkCtdopId = query.fkCtdopId;
    if (query.fkPenaltyInfoId) where.fkPenaltyInfoId = query.fkPenaltyInfoId;

    const result = await this.model.findAll({ where });

    if (!result.length) return Response.notFound("Nenhum documento de penalidade encontrado.");
    return Response.ok("Documentos de penalidade encontrados com sucesso!", result);
  }
}

export default PenaltyDocService;
