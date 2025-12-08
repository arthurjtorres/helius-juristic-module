import { ModelStatic } from "sequelize";
import PenaltyDocModel from "../database/models/PenaltyDocModel";
import PenaltyDocInterface from "../database/interfaces/PenaltyDocInterface";
import Response from "../utils/Response";
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

    const { error } = UpdateValidationSchema.UpdateValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, { where: { penaltyDocId: id } });
    if (!updated) return Response.notFound("Documento de penalidade não encontrado!");

    const result = await this.model.findByPk(id);
    return Response.ok("Documento de penalidade atualizado com sucesso!", result);
  }

  async deletePenaltyDoc(id: string) {
    const deleted = await this.model.destroy({ where: { penaltyDocId: id } });
    if (!deleted) return Response.notFound("Documento de penalidade não encontrado!");

    return Response.ok("Documento de penalidade deletado com sucesso!");
  }

  async getPenaltyDoc(id: string) {
    const result = await this.model.findByPk(id);
    if (!result) return Response.notFound("Documento de penalidade não encontrado!");

    return Response.ok("Documento de penalidade encontrado!", result);
  }

  async findPenaltyDocs(query: {
    penaltyDocType?: string;
    penaltyDocNumber?: string;
    fkCtdopId?: string;
    fkPenaltyInfoId?: string;
  }) {
    const where: any = {};

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
