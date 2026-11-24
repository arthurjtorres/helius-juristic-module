import { Op } from "sequelize";
import { ListQuery, activeWhere } from "../utils/ActiveFilter";
import { AppealModel, ProtocolModel } from "../database/models";
import ProtocolInterface from "../database/interfaces/ProtocolInterface";
import Response from "../utils/Response";
import { isUniqueViolation, uniqueConflict } from "../utils/conflict";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

/** Protocolo de recurso: número único, data e tipo (todos os recursos do protocolo são desse tipo). */
class ProtocolService {
  private model = ProtocolModel;

  private async findUniqueConflict(protocolNumber?: string, excludeId?: string) {
    if (!protocolNumber) return null;
    const where: any = { protocolNumber };
    if (excludeId) where.protocolId = { [Op.ne]: excludeId };
    const existing = await this.model.findOne({ where });
    return existing ? uniqueConflict("Número de protocolo", existing, existing.protocolId, 'protocol') : null;
  }

  async createProtocol(data: ProtocolInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.ProtocolValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const conflict = await this.findUniqueConflict(data.protocolNumber);
    if (conflict) return conflict;

    try {
      const protocol = await this.model.create({ ...data });
      return Response.created("Protocolo criado com sucesso!", { protocolId: protocol.protocolId });
    } catch (err) {
      if (isUniqueViolation(err)) return Response.conflict("Número de protocolo já cadastrado(a).");
      throw err;
    }
  }

  /** Trocar o tipo só é permitido sem recursos ativos (eles precisam ser do tipo do protocolo). */
  async updateProtocol(id: string, data: Partial<ProtocolInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateProtocolValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const record = await this.model.findOne({ where: { protocolId: id, activated: true } });
    if (!record) return Response.notFound("Protocolo não encontrado!");

    if (data.protocolType && data.protocolType !== record.protocolType
      && await AppealModel.count({ where: { fkProtocolId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível trocar o tipo: o protocolo possui recursos ativos.");
    }

    const conflict = await this.findUniqueConflict(data.protocolNumber, id);
    if (conflict) return conflict;

    await this.model.update(data, { where: { protocolId: id, activated: true } });
    const result = await this.model.findOne({ where: { protocolId: id, activated: true } });
    return Response.ok("Protocolo atualizado com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica). Bloqueia (409) se houver recursos ativos.
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteProtocol(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await AppealModel.count({ where: { fkProtocolId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: o protocolo possui recursos ativos.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { protocolId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Protocolo não encontrado!");
    return Response.ok("Protocolo desativado com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateProtocol(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const [updated] = await this.model.update(
      { activated: true, updatedBy, updatedAt: new Date() },
      { where: { protocolId: id, activated: false } }
    );
    if (!updated) return Response.notFound("Protocolo não encontrado ou já ativo!");
    return Response.ok("Protocolo reativado com sucesso!");
  }

  async getProtocol(id: string) {
    if (!id) return Response.badRequest("ID do protocolo não informado.");
    const result = await this.model.findOne({
      where: { protocolId: id, activated: true },
      include: [{ model: AppealModel, as: "Appeals", where: { activated: true }, required: false }],
    });
    if (!result) return Response.notFound("Protocolo não encontrado!");
    return Response.ok("Protocolo encontrado!", result);
  }

  async findProtocols(query: Record<string, any> & ListQuery) {
    const where: any = { ...activeWhere(query) };
    if (typeof query.protocolNumber === "string" && query.protocolNumber) {
      where.protocolNumber = { [Op.iLike]: `%${query.protocolNumber}%` };
    }
    if (typeof query.protocolType === "string" && query.protocolType) where.protocolType = query.protocolType;
    if (typeof query.protocolDate === "string" && query.protocolDate) where.protocolDate = query.protocolDate;

    const result = await this.model.findAll({ where });
    if (!result.length) return Response.notFound("Nenhum protocolo encontrado com os filtros fornecidos.");
    return Response.ok("Protocolos encontrados com sucesso", result);
  }
}

export default ProtocolService;
