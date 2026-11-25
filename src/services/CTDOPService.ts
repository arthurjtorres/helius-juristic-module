import { Op, ModelStatic, WhereAttributeHash } from "sequelize";
import { ListQuery, activeWhere } from "../utils/ActiveFilter";
import CTDOPModel from "../database/models/CTDOPModel";
import CTDOPInterface from "../database/interfaces/CTDOPInterface";
import Response from "../utils/Response";
import { AppealModel, PenaltyDocModel } from "../database/models";
import { CtdopTypeEnum } from "../database/models/enums/CtdopTypeEnum";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

/**
 * Carta de notificação ou de auto precisa de decêndio, mês e ano (identificam a carta enquanto
 * o número não chega). A de resposta não precisa.
 */
const missingReference = (c: Partial<CTDOPInterface>) =>
  c.docType !== CtdopTypeEnum.RESPOSTA && (c.period == null || c.refMonth == null || c.refYear == null)
    ? Response.badRequest("CTDOP de notificação ou de auto exige decêndio (period), mês (refMonth) e ano (refYear).")
    : null;

class CTDOPService {
  private model: ModelStatic<CTDOPModel> = CTDOPModel;

  /**
   * Verifica se `ctdopNumber` já pertence a outro registro.
   * Valores de registros inativos continuam ocupados: a resposta informa o id e a rota de reativação.
   *
   * @param data Dados informados (parciais no `PUT`).
   * @param excludeId Registro a ignorar (o próprio, no `PUT`).
   * @returns Resposta de conflito (409) ou `null` se o valor estiver livre.
   */
  private async findUniqueConflict(data: Partial<CTDOPInterface>, excludeId?: string) {
    const value = data.ctdopNumber;
    if (!value) return null;

    const where: WhereAttributeHash = { ctdopNumber: value };
    if (excludeId) where.ctdopId = { [Op.ne]: excludeId };

    const existing = await this.model.findOne({ where });
    if (!existing) return null;

    return Response.conflict(
      existing.activated
        ? "Número do CTDOP já cadastrado(a)."
        : `Número do CTDOP já existe em um registro inativo (id: ${existing.ctdopId}). Reative-o em PATCH /ctdop/${existing.ctdopId}/reactivate.`
    );
  }

  async createCTDOP(data: CTDOPInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.CTDOPValidation.validate(data);
    if (error) return Response.badRequest(error.message);
    if (data.ctdopNumber === '') data.ctdopNumber = null;

    const invalid = missingReference(data) ?? await this.findUniqueConflict(data);
    if (invalid) return invalid;

    const ctdop = await this.model.create({ ...data });
    return Response.created("CTDOP criado com sucesso!", { ctdopId: ctdop.ctdopId });
  }

  async updateCTDOP(id: string, data: Partial<CTDOPInterface>) {
    if(!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateCTDOPValidation.validate(data);
    if (error) return Response.badRequest(error.message);
    if (data.ctdopNumber === '') data.ctdopNumber = null;

    const record = await this.model.findOne({ where: { ctdopId: id, activated: true } });
    if (!record) return Response.notFound("CTDOP não encontrado!");

    if (data.docType && data.docType !== record.docType && await this.hasLinks(id)) {
      return Response.conflict("Não é possível trocar o tipo: o CTDOP possui documentos ou respostas de recurso vinculados.");
    }

    const invalid = missingReference({ ...record.get({ plain: true }), ...data }) ?? await this.findUniqueConflict(data, id);
    if (invalid) return invalid;

    const [updated] = await this.model.update(data, {
      where: { ctdopId: id, activated: true },
    });

    if (!updated) return Response.notFound("CTDOP não encontrado!");
    const result = await this.model.findOne({ where: { ctdopId: id, activated: true } });
    return Response.ok("CTDOP atualizado com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   * Bloqueia (409) se houver dependentes ativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteCTDOP(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await PenaltyDocModel.count({ where: { fkCtdopId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: o CTDOP possui documentos de penalidade ativos.");
    }
    if (await AppealModel.count({ where: { fkResponseCtdopId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: o CTDOP é resposta de recursos ativos.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { ctdopId: id, activated: true } }
    );
    if (!updated) return Response.notFound("CTDOP não encontrado!");

    return Response.ok("CTDOP desativado com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateCTDOP(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const [updated] = await this.model.update(
      { activated: true, updatedBy, updatedAt: new Date() },
      { where: { ctdopId: id, activated: false } }
    );
    if (!updated) return Response.notFound("CTDOP não encontrado ou já ativo!");

    return Response.ok("CTDOP reativado com sucesso!");
  }

  /** Documentos ou recursos (ativos ou não) que dependem do tipo deste CTDOP. */
  private async hasLinks(id: string) {
    return (await PenaltyDocModel.count({ where: { fkCtdopId: id } })) > 0
      || (await AppealModel.count({ where: { fkResponseCtdopId: id } })) > 0;
  }

  async getCTDOP(id: string) {
    if (!id) return Response.badRequest("ID do CTDOP não informado.");

    const result = await this.model.findOne({ where: { ctdopId: id, activated: true } });
    if (!result) return Response.notFound("CTDOP não encontrado!");
    return Response.ok("CTDOP encontrado!", result);
  }

  async findCTDOPs(query: Record<string, unknown> & ListQuery) {
    const where: WhereAttributeHash = { ...activeWhere(query) };

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
