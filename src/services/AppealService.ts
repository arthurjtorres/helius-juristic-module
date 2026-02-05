import { Op, ModelStatic } from "sequelize";
import AppealModel from "../database/models/AppealModel";
import AppealInterface from "../database/interfaces/AppealInterface";
import Response from "../utils/Response";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class AppealService {
  private model: ModelStatic<AppealModel> = AppealModel;

  async createAppeal(data: AppealInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.AppealValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    await this.model.create({ ...data });
    return Response.created("Recurso criado com sucesso!");
  }

  async updateAppeal(id: string, data: Partial<AppealInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateAppealValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, {
      where: { appealId: id },
    });

    if (!updated) return Response.notFound("Recurso não encontrado!");
    const result = await this.model.findByPk(id);
    return Response.ok("Recurso atualizado com sucesso!", result);
  }

  async deleteAppeal(id: string) {
    const deleted = await this.model.destroy({ where: { appealId: id } });

    if (!deleted) return Response.notFound("Recurso não encontrado!");
    return Response.ok("Recurso deletado com sucesso!");
  }

  async getAppeal(id: string) {
    if (!id) return Response.badRequest("ID do recurso não informado.");

    const result = await this.model.findByPk(id);
    if (!result) return Response.notFound("Recurso não encontrado!");
    return Response.ok("Recurso encontrado!", result);
  }

  async findAppeals(query: Partial<AppealInterface>) {
    const where: any = {};

    if (query.appealType) where.appealType = query.appealType;
    if (query.protocolNumber) where.protocolNumber = { [Op.iLike]: `%${query.protocolNumber}%` };
    if (query.protocolDate) where.protocolDate = query.protocolDate;

    const result = await this.model.findAll({ where });

    if (!result.length) return Response.notFound("Nenhum recurso encontrado com os filtros fornecidos.");
    return Response.ok("Recursos encontrados com sucesso", result);
  }
}

export default AppealService;
