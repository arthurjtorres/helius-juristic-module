import { ModelStatic, Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import PenaltyInfoModel from "../database/models/PenaltyInfoModel";
import PenaltyDocModel from "../database/models/PenaltyDocModel";
import AppealModel from "../database/models/AppealModel";
import PenaltyInfoInterface from "../database/interfaces/PenaltyInfoInterface";
import { DocTypeEnum } from "../database/models/enums/DocTypeEnum";
import { buildPenaltyInfoView } from "./integrations/PenaltyInfoAggregator";
import Response from "../utils/Response";
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

    const [updated] = await this.model.update(data, { where: { penaltyInfoId: id } });
    if (!updated) return Response.notFound("Penalidade não encontrada!");

    const result = await this.model.findByPk(id, {
      include: [
        { model: PenaltyDocModel, as: "PenaltyDoc", include: [
          { model: AppealModel, as: "Appeal" }
        ]},
      ]
    });

    return Response.ok("Penalidade atualizada com sucesso!", result);
  }

  async deletePenalty(id: string) {
    const deleted = await this.model.destroy({ where: { penaltyInfoId: id } });
    if (!deleted) return Response.notFound("Penalidade não encontrada!");

    return Response.ok("Penalidade deletada com sucesso!");
  }

  async getPenalty(id: string) {
    const penalty = await this.model.findByPk(id, {
      include: [
        { model: PenaltyDocModel, as: "PenaltyDoc", include: [
          { model: AppealModel, as: "Appeal" }
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
    const where: Partial<Record<keyof typeof query, string>> = {};

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
        { model: PenaltyDocModel, as: "PenaltyDoc", include: [
          { model: AppealModel, as: "Appeal" }
        ]},
      ],
    });

    if (!results.length) return Response.notFound("Nenhuma penalidade encontrada com os filtros fornecidos.");
    return Response.ok("Penalidades encontradas com sucesso!", results);
  }

}

export default PenaltyInfoService;
