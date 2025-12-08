import { ModelStatic } from "sequelize";
import AnalysisModel from "../database/models/AnalysisModel";
import AnalysisInterface from "../database/interfaces/AnalysisInterface";
import Response from "../utils/Response";
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

    const { error } = UpdateValidationSchema.UpdateValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, { where: { analysisId: id } });
    if (!updated) return Response.notFound("Análise não encontrada!");

    const result = await this.model.findByPk(id);
    return Response.ok("Análise atualizada com sucesso!", result);
  }

  async deleteAnalysis(id: string) {
    const deleted = await this.model.destroy({ where: { analysisId: id } });
    if (!deleted) return Response.notFound("Análise não encontrada!");

    return Response.ok("Análise deletada com sucesso!");
  }

  async getAnalysis(id: string) {
    const result = await this.model.findByPk(id);
    if (!result) return Response.notFound("Análise não encontrada!");
    return Response.ok("Análise encontrada!", result);
  }

  async findAnalyses(query: { fkPenaltyInfoId?: string; fkEmployeeId?: string }) {
    const where: any = {};
    if (query.fkPenaltyInfoId) where.fkPenaltyInfoId = query.fkPenaltyInfoId;
    if (query.fkEmployeeId) where.fkEmployeeId = query.fkEmployeeId;

    const result = await this.model.findAll({ where });

    if (!result.length) return Response.notFound("Nenhuma análise encontrada.");
    return Response.ok("Análises encontradas com sucesso!", result);
  }
}

export default AnalysisService;
