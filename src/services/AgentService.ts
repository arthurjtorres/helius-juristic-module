import { ModelStatic, Op } from "sequelize";
import AgentModel from "../database/models/AgentModel";
import AgentInterface from "../database/interfaces/AgentInterface";
import Response from "../utils/Response";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class AgentService {
  private model: ModelStatic<AgentModel> = AgentModel;

  async createAgent(data: AgentInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.AgentValidation.validate(data);

    if (error) return Response.badRequest(error.message);

    await this.model.create({ ...data });
    return Response.created("Agente criado com sucesso!");
  }

  async updateAgent(id: string, data: Partial<AgentInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, {
      where: { agentId: id },
    });

    if (!updated) return Response.notFound("Agente não encontrado!");

    const result = await this.model.findByPk(id);
    return Response.ok("Agente atualizado com sucesso!", result);
  }

  async deleteAgent(id: string) {
    const deleted = await this.model.destroy({ where: { agentId: id } });

    if (!deleted) return Response.notFound("Agente não encontrado!");
    return Response.ok("Agente deletado com sucesso!");
  }

  async getAgent(id: string) {
    if (!id) return Response.badRequest("ID do agente não informado.");

    const result = await this.model.findByPk(id);
    if (!result) return Response.notFound("Agente não encontrado!");

    return Response.ok("Agente encontrado!", result);
  }

  async findAgent(query: Partial<AgentInterface>) {
    const where: any = {};

    if (query.agentCode) {
      where.agentCode = { [Op.iLike]: `%${query.agentCode}%` };
    }

    const result = await this.model.findAll({ where });

    if (!result.length) {
      return Response.notFound("Nenhum agente encontrado com os filtros fornecidos.");
    }

    return Response.ok("Agentes encontrados com sucesso", result);
  }
}

export default AgentService;
