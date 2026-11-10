import { Op, ModelStatic } from "sequelize";
import AppealModel from "../database/models/AppealModel";
import AppealInterface from "../database/interfaces/AppealInterface";
import Response from "../utils/Response";
import { PenaltyDocModel } from "../database/models";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class AppealService {
  private model: ModelStatic<AppealModel> = AppealModel;

  /**
   * Verifica se `protocolNumber` já pertence a outro registro.
   * Valores de registros inativos continuam ocupados: a resposta informa o id e a rota de reativação.
   *
   * @param data Dados informados (parciais no `PUT`).
   * @param excludeId Registro a ignorar (o próprio, no `PUT`).
   * @returns Resposta de conflito (409) ou `null` se o valor estiver livre.
   */
  private async findUniqueConflict(data: Partial<AppealInterface>, excludeId?: string) {
    const value = data.protocolNumber;
    if (!value) return null;

    const where: any = { protocolNumber: value };
    if (excludeId) where.appealId = { [Op.ne]: excludeId };

    const existing = await this.model.findOne({ where });
    if (!existing) return null;

    return Response.conflict(
      existing.activated
        ? "Número de protocolo já cadastrado(a)."
        : `Número de protocolo já existe em um registro inativo (id: ${existing.appealId}). Reative-o em PATCH /appeal/${existing.appealId}/reactivate.`
    );
  }

  async createAppeal(data: AppealInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.AppealValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const conflict = await this.findUniqueConflict(data);
    if (conflict) return conflict;

    await this.model.create({ ...data });
    return Response.created("Recurso criado com sucesso!");
  }

  async updateAppeal(id: string, data: Partial<AppealInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateAppealValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const conflict = await this.findUniqueConflict(data, id);
    if (conflict) return conflict;

    const [updated] = await this.model.update(data, {
      where: { appealId: id, activated: true },
    });

    if (!updated) return Response.notFound("Recurso não encontrado!");
    const result = await this.model.findOne({ where: { appealId: id, activated: true } });
    return Response.ok("Recurso atualizado com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteAppeal(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { appealId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Recurso não encontrado!");

    return Response.ok("Recurso desativado com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   * Responde 409 se um registro pai estiver inativo.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateAppeal(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const record = await this.model.findOne({ where: { appealId: id, activated: false } });
    if (!record) return Response.notFound("Recurso não encontrado ou já ativo!");

    if (!(await PenaltyDocModel.count({ where: { penaltyDocId: record.fkPenaltyDocId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: o documento de penalidade está inativo.");
    }

    await record.update({ activated: true, updatedBy, updatedAt: new Date() });

    return Response.ok("Recurso reativado com sucesso!");
  }

  async getAppeal(id: string) {
    if (!id) return Response.badRequest("ID do recurso não informado.");

    const result = await this.model.findOne({ where: { appealId: id, activated: true } });
    if (!result) return Response.notFound("Recurso não encontrado!");
    return Response.ok("Recurso encontrado!", result);
  }

  async findAppeals(query: Partial<AppealInterface>) {
    const where: any = { activated: true };

    if (query.appealType) where.appealType = query.appealType;
    if (query.protocolNumber) where.protocolNumber = { [Op.iLike]: `%${query.protocolNumber}%` };
    if (query.protocolDate) where.protocolDate = query.protocolDate;

    const result = await this.model.findAll({ where });

    if (!result.length) return Response.notFound("Nenhum recurso encontrado com os filtros fornecidos.");
    return Response.ok("Recursos encontrados com sucesso", result);
  }
}

export default AppealService;
