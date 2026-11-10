import { ModelStatic, Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import PenaltyInfoModel from "../database/models/PenaltyInfoModel";
import PenaltyDocModel from "../database/models/PenaltyDocModel";
import AppealModel from "../database/models/AppealModel";
import PenaltyInfoInterface from "../database/interfaces/PenaltyInfoInterface";
import { DocTypeEnum } from "../database/models/enums/DocTypeEnum";
import { buildPenaltyInfoView } from "./integrations/PenaltyInfoAggregator";
import Response from "../utils/Response";
import { AgentModel, AnalysisModel, FineCodeModel, MotiveModel } from "../database/models";
import CreateValidationSchema from "./validations/CreateValidationSchema";
import UpdateValidationSchema from "./validations/UpdateValidationSchema";

class PenaltyInfoService {
  private model: ModelStatic<PenaltyInfoModel> = PenaltyInfoModel;

  async createPenalty(data: PenaltyInfoInterface & {
    docType: DocTypeEnum;
    penaltyDocRegistration: string; //AS13250
    penaltyDocNumber: string;       //13250
    fkCtdopId: string;              //Id da Ctdop
  }) {
    
    data.createdAt = new Date();
    const { error } = CreateValidationSchema.PenaltyInfoValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const penaltyInfoId = uuidv4();

    await this.model.create({
      penaltyInfoId,
      ...data,
    });

    await PenaltyDocModel.create({
      penaltyDocId: uuidv4(),
      penaltyDocType: data.docType,
      penaltyDocRegistration: data.penaltyDocRegistration,
      penaltyDocNumber: data.penaltyDocNumber,
      fkCtdopId: data.fkCtdopId,
      fkPenaltyInfoId: penaltyInfoId,
    });

    return Response.created("Penalidade e documento criados com sucesso!");
  }

  async updatePenalty(id: string, data: Partial<PenaltyInfoInterface>) {
    if (!id) return Response.badRequest("ID não informado");
    data.updatedAt = new Date();

    const { error } = UpdateValidationSchema.UpdatePenaltyInfoValidation.validate(data);
    if (error) return Response.badRequest(error.message);

    const [updated] = await this.model.update(data, { where: { penaltyInfoId: id, activated: true } });
    if (!updated) return Response.notFound("Penalidade não encontrada!");

    const result = await this.model.findOne({
      where: { penaltyInfoId: id, activated: true },
      include: [
        { model: PenaltyDocModel, as: "PenaltyDoc", where: { activated: true }, required: false, include: [
          { model: AppealModel, as: "Appeal", where: { activated: true }, required: false }
        ]},
      ]
    });

    return Response.ok("Penalidade atualizada com sucesso!", result);
  }

  /**
   * Desativa o registro (exclusão lógica): `activated = false`.
   * Bloqueia (409) se houver dependentes ativos.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async deletePenalty(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    if (await PenaltyDocModel.count({ where: { fkPenaltyInfoId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: a penalidade possui documentos ativos.");
    }

    if (await AnalysisModel.count({ where: { fkPenaltyInfoId: id, activated: true } }) > 0) {
      return Response.conflict("Não é possível desativar: a penalidade possui análises ativas.");
    }

    const [updated] = await this.model.update(
      { activated: false, updatedBy, updatedAt: new Date() },
      { where: { penaltyInfoId: id, activated: true } }
    );
    if (!updated) return Response.notFound("Penalidade não encontrada!");

    return Response.ok("Penalidade desativada com sucesso!");
  }

  /**
   * Reativa um registro desativado (`activated = true`).
   * Responde 409 se um registro pai estiver inativo.
   *
   * @param id Identificador do registro.
   * @param updatedBy Usuário autenticado que executa a operação.
   */
  async reactivatePenalty(id: string, updatedBy: string) {
    if (!id) return Response.badRequest("ID não informado");

    const record = await this.model.findOne({ where: { penaltyInfoId: id, activated: false } });
    if (!record) return Response.notFound("Penalidade não encontrada ou já ativa!");

    if (!(await AgentModel.count({ where: { agentId: record.fkAgentId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: o agente está inativo.");
    }
    if (!(await FineCodeModel.count({ where: { fineCodeId: record.fkFineCodeId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: o código de infração está inativo.");
    }
    if (!(await MotiveModel.count({ where: { motiveId: record.fkMotiveId, activated: true } }))) {
      return Response.conflict("Não é possível reativar: o motivo está inativo.");
    }

    await record.update({ activated: true, updatedBy, updatedAt: new Date() });

    return Response.ok("Penalidade reativada com sucesso!");
  }

  async getPenalty(id: string) {
    const penalty = await this.model.findOne({
      where: { penaltyInfoId: id, activated: true },
      include: [
        { model: PenaltyDocModel, as: "PenaltyDoc", where: { activated: true }, required: false, include: [
          { model: AppealModel, as: "Appeal", where: { activated: true }, required: false }
        ]},
      ],
    });

    if (!penalty) return Response.notFound("Penalidade não encontrada!");

    const result = await buildPenaltyInfoView(penalty);
    return Response.ok("Penalidade encontrada!", result);
  }

  /**
   * Busca penalidades por filtros locais. Empresa, veículo, itinerário e local
   * são filtrados pelas colunas `fk*Id` de `penalty_info`, sem consultar outros módulos.
   *
   * @param query Filtros opcionais (todos por igualdade, exceto quando indicado).
   */
  async findPenalties(query: {
    fkCompanyId?: string;
    fkVehicleId?: string;
    fkBusTimetableId?: string;
    fkLocationId?: string;
    fkAgentId?: string;
    fkFineCodeId?: string;
    fkMotiveId?: string;
    date?: string;
    penaltyInfoStatus?: string;
  }) {
    const where: Record<string, string | boolean> = { activated: true };

    const filterKeys = [
      'fkCompanyId', 'fkVehicleId', 'fkBusTimetableId', 'fkLocationId',
      'fkAgentId', 'fkFineCodeId', 'fkMotiveId', 'date', 'penaltyInfoStatus',
    ] as const;
    for (const key of filterKeys) {
      if (query[key]) where[key] = query[key];
    }

    const results = await this.model.findAll({
      where,
      include: [
        { model: PenaltyDocModel, as: "PenaltyDoc", where: { activated: true }, required: false, include: [
          { model: AppealModel, as: "Appeal", where: { activated: true }, required: false }
        ]},
      ],
    });

    if (!results.length) return Response.notFound("Nenhuma penalidade encontrada com os filtros fornecidos.");
    return Response.ok("Penalidades encontradas com sucesso!", results);
  }

}

export default PenaltyInfoService;
