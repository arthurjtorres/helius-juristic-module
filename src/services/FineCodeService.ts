import { ModelStatic, Op } from "sequelize";
import FineCodeModel from "../database/models/FineCodeModel";
import FineCodeInterface from "../database/interfaces/FineCodeInterface";
import Response from "../utils/Response";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class FineCodeService {
  private model: ModelStatic<FineCodeModel> = FineCodeModel;

  async createFineCode(data: FineCodeInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.FineCodeValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    await this.model.create({ ...data });
    return Response.created("Código de infração criado com sucesso!");
  }

  async updateFineCode(id: string, data: Partial<FineCodeInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, {
      where: { fineCodeId: id },
    });

    if (!updated) return Response.notFound("Código de infração não encontrado!");

    const result = await this.model.findByPk(id);
    return Response.ok("Código de infração atualizado com sucesso!", result);
  }

  async deleteFineCode(id: string) {
    const deleted = await this.model.destroy({ where: { fineCodeId: id } });

    if (!deleted) return Response.notFound("Código de infração não encontrado!");
    return Response.ok("Código de infração deletado com sucesso!");
  }

  async getFineCode(id: string) {
    if (!id) return Response.badRequest("ID do código de infração não informado.");

    const result = await this.model.findByPk(id);
    if (!result) return Response.notFound("Código de infração não encontrado!");

    return Response.ok("Código de infração encontrado!", result);
  }

  async findFineCode(query: Partial<FineCodeInterface>) {
    const where: any = {};

    if (query.fineDescription)
      where.fineDescription = { [Op.iLike]: `%${query.fineDescription}%` };
    if (query.fineKm) where.fineKm = { [Op.iLike]: `%${query.fineKm}%` };
    if (query.fineAlias) where.fineAlias = { [Op.iLike]: `%${query.fineAlias}%` };
    if (query.fineOrder) where.fineOrder = { [Op.iLike]: `%${query.fineOrder}%` };

    const result = await this.model.findAll({ where });

    if (!result.length) {
      return Response.notFound("Nenhum código de infração encontrado com os filtros fornecidos.");
    }

    return Response.ok("Códigos de infração encontrados com sucesso", result);
  }
}

export default FineCodeService;
