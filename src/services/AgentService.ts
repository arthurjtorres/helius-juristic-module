import { ModelStatic, Op } from "sequelize";
import AgentModel from "../database/models/AgentModel";
import AgentInterface from "../database/interfaces/AgentInterface";
import Response from "../utils/Response";
import { PenaltyInfoModel } from "../database/models";
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

    const { error } = UpdateValidationSchema.UpdateAgentValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, {
      where: { agentId: id, activated: true },
    });

    if (!updated) return Response.notFound("Agente não encontrado!");

    const result = await this.model.findOne({ where: { agentId: id, activated: true } });
    return Response.ok("Agente atualizado com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   * Bloqueia (409) se houver dependentes ativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteAgent(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await PenaltyInfoModel.count({ where: { fkAgentId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: o agente possui penalidades ativas.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { agentId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Agente não encontrado!");

    return Response.ok("Agente desativado com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateAgent(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const [updated] = await this.model.update(
      { activated: true, updatedBy, updatedAt: new Date() },
      { where: { agentId: id, activated: false } }
    );
    if (!updated) return Response.notFound("Agente não encontrado ou já ativo!");

    return Response.ok("Agente reativado com sucesso!");
  }

  async getAgent(id: string) {
    if (!id) return Response.badRequest("ID do agente não informado.");

    const result = await this.model.findOne({ where: { agentId: id, activated: true } });
    if (!result) return Response.notFound("Agente não encontrado!");

    return Response.ok("Agente encontrado!", result);
  }

  async findAgent(query: Partial<AgentInterface>) {
    const where: any = { activated: true };

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
