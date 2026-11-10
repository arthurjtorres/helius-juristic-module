import { ModelStatic, Op } from "sequelize";
import MotiveModel from "../database/models/MotiveModel";
import MotiveInterface from "../database/interfaces/MotiveInterface";
import Response from "../utils/Response";
import { PenaltyInfoModel } from "../database/models";
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
      where: { motiveId: id, activated: true },
    });

    if (!updated) return Response.notFound("Motivo não encontrado!");

    const result = await this.model.findOne({ where: { motiveId: id, activated: true } });
    return Response.ok("Motivo atualizado com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   * Bloqueia (409) se houver dependentes ativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deleteMotive(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await PenaltyInfoModel.count({ where: { fkMotiveId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: o motivo possui penalidades ativas.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { motiveId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Motivo não encontrado!");

    return Response.ok("Motivo desativado com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivateMotive(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const [updated] = await this.model.update(
      { activated: true, updatedBy, updatedAt: new Date() },
      { where: { motiveId: id, activated: false } }
    );
    if (!updated) return Response.notFound("Motivo não encontrado ou já ativo!");

    return Response.ok("Motivo reativado com sucesso!");
  }

  async getMotive(id: string) {
    if (!id) return Response.badRequest("ID do motivo não informado.");

    const result = await this.model.findOne({ where: { motiveId: id, activated: true } });
    if (!result) return Response.notFound("Motivo não encontrado!");

    return Response.ok("Motivo encontrado!", result);
  }

  async findMotives(query: Partial<MotiveInterface>) {
    const where: any = { activated: true };

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
