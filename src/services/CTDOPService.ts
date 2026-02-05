import { Op, ModelStatic } from "sequelize";
import CTDOPModel from "../database/models/CTDOPModel";
import CTDOPInterface from "../database/interfaces/CTDOPInterface";
import Response from "../utils/Response";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class CTDOPService {
  private model: ModelStatic<CTDOPModel> = CTDOPModel;

  async createCTDOP(data: CTDOPInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.CTDOPValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    await this.model.create({ ...data });
    return Response.created("CTDOP criado com sucesso!");
  }

  async updateCTDOP(id: string, data: Partial<CTDOPInterface>) {
    if(!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateCTDOPValidation.validate(data);    
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, {
      where: { ctdopId: id },
    });

    if (!updated) return Response.notFound("CTDOP não encontrado!");
    const result = await this.model.findByPk(id);
    return Response.ok("CTDOP atualizado com sucesso!", result);
  }

  async deleteCTDOP(id: string) {
    const deleted = await this.model.destroy({ where: { ctdopId: id } });

    if (!deleted) return Response.notFound("CTDOP não encontrado!");
    return Response.ok("CTDOP deletado com sucesso!");
  }

  async getCTDOP(id: string) {
    if (!id) return Response.badRequest("ID do CTDOP não informado.");

    const result = await this.model.findByPk(id);
    if (!result) return Response.notFound("CTDOP não encontrado!");
    return Response.ok("CTDOP encontrado!", result);
  }

  async findCTDOPs(query: Partial<CTDOPInterface>) {
    const where: any = {};

    if (query.ctdopNumber) {
      where.ctdopNumber = { [Op.iLike]: `%${query.ctdopNumber}%` };
    }

    if (query.docType) {
      where.docType = query.docType;
    }

    if (query.refMonth) {
      where.refMonth = query.refMonth;
    }

    if (query.period) {
      where.period = query.period;
    }

    if (query.refYear) {
      where.refYear = query.refYear;
    }

    const result = await this.model.findAll({ where });

    if (!result.length) return Response.notFound("Nenhum CTDOP encontrado com os filtros fornecidos.");
    return Response.ok("CTDOPs encontrados com sucesso", result);
  }
}

export default CTDOPService;
