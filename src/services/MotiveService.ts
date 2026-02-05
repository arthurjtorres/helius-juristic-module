import { ModelStatic, Op } from "sequelize";
import MotiveModel from "../database/models/MotiveModel";
import MotiveInterface from "../database/interfaces/MotiveInterface";
import Response from "../utils/Response";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class MotiveService {
  private model: ModelStatic<MotiveModel> = MotiveModel;

  async createMotive(data: MotiveInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.MotiveValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    await this.model.create({ ...data });
    return Response.created("Motivo criado com sucesso!");
  }

  async updateMotive(id: string, data: Partial<MotiveInterface>) {
    if(!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateMotiveValidation.validate(data);    
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, {
      where: { motiveId: id },
    });

    if (!updated) return Response.notFound("Motivo não encontrado!");

    const result = await this.model.findByPk(id);
    return Response.ok("Motivo atualizado com sucesso!", result);
  }

  async deleteMotive(id: string) {
    const deleted = await this.model.destroy({ where: { motiveId: id } });

    if (!deleted) return Response.notFound("Motivo não encontrado!");
    return Response.ok("Motivo deletado com sucesso!");
  }

  async getMotive(id: string) {
    if (!id) return Response.badRequest("ID do motivo não informado.");

    const result = await this.model.findByPk(id);
    if (!result) return Response.notFound("Motivo não encontrado!");

    return Response.ok("Motivo encontrado!", result);
  }

  async findMotives(query: Partial<MotiveInterface>) {
    const where: any = {};

    if (query.motiveName) {
      where.motiveName = { [Op.iLike]: `%${query.motiveName}%` };
    }

    const result = await this.model.findAll({ where });

    if (!result.length) {
      return Response.notFound("Nenhum motivo encontrado com os filtros fornecidos.");
    }

    return Response.ok("Motivos encontrados com sucesso", result);
  }
}

export default MotiveService;
