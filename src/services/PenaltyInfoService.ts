import { ModelStatic, Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import PenaltyInfoModel from "../database/models/PenaltyInfoModel";
import PenaltyDocModel from "../database/models/PenaltyDocModel";
import AppealModel from "../database/models/AppealModel";
import PenaltyInfoInterface from "../database/interfaces/PenaltyInfoInterface";
import { DocTypeEnum } from "../database/models/enums/DocTypeEnum";
import { buildPenaltyInfoView } from "./integrations/PenaltyInfoAggregator";
import { getBusTimetableById, getCompanyById, getLocationById, getVehicleById } from "./integrations/integrationService.ts";
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
        { model: PenaltyDocModel, as: "penaltyDocs" },
        { model: AppealModel, as: "appeals" },
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
        { model: PenaltyDocModel, as: "penaltyDocs" },
        { model: AppealModel, as: "appeals" },
      ],
    });

    if (!penalty) return Response.notFound("Penalidade não encontrada!");

    const result = await buildPenaltyInfoView(penalty);
    return Response.ok("Penalidade encontrada!", result);
  }

  //Refazer esse método, tem que dar pra pesquisar por company, vehicle, bustimetable, location, date, agent, finecode, status, motive
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
    const where: any = {};

    // Filtros diretos
    if (query.date) where.date = query.date;
    if (query.penaltyInfoStatus) where.penaltyInfoStatus = query.penaltyInfoStatus;

    // Filtros internos (mesma API)
    if (query.fkAgentId) where.fkAgentId = query.fkAgentId;
    if (query.fkFineCodeId) where.fkFineCodeId = query.fkFineCodeId;
    if (query.fkMotiveId) where.fkMotiveId = query.fkMotiveId;

    const results = await this.model.findAll({
      where,
      include: [
        { model: PenaltyDocModel, as: "PenaltyDoc" , include: [
          { model: AppealModel, as: "Appeal"}
        ]},
        
      ],
    });

    if (!results.length) return Response.notFound("Nenhuma penalidade encontrada.");

    const filtered = await Promise.all(
      results.map(async (penalty) => {
        const {
          fkCompanyId,
          fkVehicleId,
          fkBusTimetableId,
          fkLocationId,
        } = penalty;

        const [
          company,
          vehicle,
          busTimetable,
          location
        ] = await Promise.all([
          query.fkCompanyId ? getCompanyById(fkCompanyId) : null,
          query.fkVehicleId ? getVehicleById(fkVehicleId) : null,
          query.fkBusTimetableId ? getBusTimetableById(fkBusTimetableId) : null,
          query.fkLocationId ? getLocationById(fkLocationId) : null,
        ]);

        const isMatch =
          (!query.fkCompanyId || company?.data?.companyId === query.fkCompanyId) &&
          (!query.fkVehicleId || vehicle?.data?.vehicleId === query.fkVehicleId) &&
          (!query.fkBusTimetableId || busTimetable?.data?.busTimetableId === query.fkBusTimetableId) &&
          (!query.fkLocationId || location?.data?.locationId === query.fkLocationId);

        if (!isMatch) return null;

        return {
          ...penalty.toJSON(),
          company: company?.data || null,
          vehicle: vehicle?.data || null,
          busTimetable: busTimetable?.data || null,
          location: location?.data || null,
        };
      })
    );

    const finalResult = filtered.filter(Boolean);

    if (!finalResult.length) return Response.notFound("Nenhuma penalidade encontrada com os filtros fornecidos.");
    return Response.ok("Penalidades encontradas com sucesso!", finalResult);
  }

}

export default PenaltyInfoService;
