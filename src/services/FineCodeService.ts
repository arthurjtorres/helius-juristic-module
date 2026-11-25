import { ModelStatic, Op, WhereAttributeHash } from "sequelize";
import { ListQuery, activeWhere } from "../utils/ActiveFilter";
import FineCodeModel from "../database/models/FineCodeModel";
import FineCodeInterface from "../database/interfaces/FineCodeInterface";
import Response from "../utils/Response";
import { isUniqueViolation, uniqueConflict } from "../utils/conflict";
import { PenaltyInfoModel } from "../database/models";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class FineCodeService {
  private model: ModelStatic<FineCodeModel> = FineCodeModel;

  /** `fineNumber` é único; sem ele, o banco usa o próximo da sequência. */
  private async findUniqueConflict(fineNumber?: string, excludeId?: string) {
    if (!fineNumber) return null;
    const where: WhereAttributeHash = { fineNumber };
    if (excludeId) where.fineCodeId = { [Op.ne]: excludeId };
    const existing = await this.model.findOne({ where });
    return existing ? uniqueConflict("Número do código de infração", existing, existing.fineCodeId, 'fine-code') : null;
  }

  async createFineCode(data: FineCodeInterface) {
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.FineCodeValidation.validate(data, { convert: true });
    if (error) return Response.badRequest(error.message);

    const conflict = await this.findUniqueConflict(data.fineNumber);
    if (conflict) return conflict;

    try {
      await this.model.create({ ...data, fineKm: Number(data.fineKm) });
    } catch (err) {
      // A sequência pode gerar um número já usado (código cadastrado com número informado).
      if (isUniqueViolation(err)) return Response.conflict("O número gerado para o código já existe; informe o número (fineNumber).");
      throw err;
    }
    return Response.created("Código de infração criado com sucesso!");
  }

  async updateFineCode(id: string, data: Partial<FineCodeInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdateFineCodeValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const conflict = await this.findUniqueConflict(data.fineNumber, id);
    if (conflict) return conflict;
    if (data.fineKm !== undefined) data.fineKm = Number(data.fineKm);

    const [updated] = await this.model.update(data, {
      where: { fineCodeId: id, activated: true },
    });

    if (!updated) return Response.notFound("Código de infração não encontrado!");

    const result = await this.model.findOne({ where: { fineCodeId: id, activated: true } });
    return Response.ok("Código de infração atualizado com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   * Bloqueia (409) se houver dependentes ativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteFineCode(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await PenaltyInfoModel.count({ where: { fkFineCodeId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: o código de infração possui penalidades ativas.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { fineCodeId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Código de infração não encontrado!");

    return Response.ok("Código de infração desativado com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateFineCode(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const [updated] = await this.model.update(
      { activated: true, updatedBy, updatedAt: new Date() },
      { where: { fineCodeId: id, activated: false } }
    );
    if (!updated) return Response.notFound("Código de infração não encontrado ou já ativo!");

    return Response.ok("Código de infração reativado com sucesso!");
  }

  async getFineCode(id: string) {
    if (!id) return Response.badRequest("ID do código de infração não informado.");

    const result = await this.model.findOne({ where: { fineCodeId: id, activated: true } });
    if (!result) return Response.notFound("Código de infração não encontrado!");

    return Response.ok("Código de infração encontrado!", result);
  }

  async findFineCode(query: Partial<FineCodeInterface> & ListQuery) {
    const where: WhereAttributeHash = { ...activeWhere(query) };

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
