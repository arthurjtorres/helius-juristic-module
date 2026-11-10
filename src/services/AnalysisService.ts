import { ModelStatic } from "sequelize";
import AnalysisModel from "../database/models/AnalysisModel";
import AnalysisInterface from "../database/interfaces/AnalysisInterface";
import Response from "../utils/Response";
import { PenaltyInfoModel } from "../database/models";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class AnalysisService {
  private model: ModelStatic<AnalysisModel> = AnalysisModel;

  async createAnalysis(data: AnalysisInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.AnalysisValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    await this.model.create({ ...data });
    return Response.created("Análise registrada com sucesso!");
  }

  async updateAnalysis(id: string, data: Partial<AnalysisInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateAnalysisValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, { where: { analysisId: id, activated: true } });
    if (!updated) return Response.notFound("Análise não encontrada!");

    const result = await this.model.findOne({ where: { analysisId: id, activated: true } });
    return Response.ok("Análise atualizada com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteAnalysis(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { analysisId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Análise não encontrada!");

    return Response.ok("Análise desativada com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   * Responde 409 se um registro pai estiver inativo.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateAnalysis(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const record = await this.model.findOne({ where: { analysisId: id, activated: false } });
    if (!record) return Response.notFound("Análise não encontrada ou já ativa!");

    if (!(await PenaltyInfoModel.count({ where: { penaltyInfoId: record.fkPenaltyInfoId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: a penalidade está inativa.");
    }

    await record.update({ activated: true, updatedBy, updatedAt: new Date() });

    return Response.ok("Análise reativada com sucesso!");
  }

  async getAnalysis(id: string) {
    const result = await this.model.findOne({ where: { analysisId: id, activated: true } });
    if (!result) return Response.notFound("Análise não encontrada!");
    return Response.ok("Análise encontrada!", result);
  }

  async findAnalyses(query: { fkPenaltyInfoId?: string; fkEmployeeId?: string }) {
    const where: any = { activated: true };
    if (query.fkPenaltyInfoId) where.fkPenaltyInfoId = query.fkPenaltyInfoId;
    if (query.fkEmployeeId) where.fkEmployeeId = query.fkEmployeeId;

    const result = await this.model.findAll({ where });

    if (!result.length) return Response.notFound("Nenhuma análise encontrada.");
    return Response.ok("Análises encontradas com sucesso!", result);
  }
}

export default AnalysisService;
