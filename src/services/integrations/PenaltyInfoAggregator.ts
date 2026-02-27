import { getBusTimetableById, getCompanyById, getLocationById, getVehicleById } from "./integrationService";
import PenaltyInfoModel from "../../database/models/PenaltyInfoModel";

export const buildPenaltyInfoView = async (penalty: PenaltyInfoModel) => {
  try {
    const [company, vehicle, timetable, location] = await Promise.all([
      getCompanyById(penalty.fkCompanyId),
      getVehicleById(penalty.fkVehicleId),
      getBusTimetableById(penalty.fkBusTimetableId),
      getLocationById(penalty.fkLocationId),
    ]);

    return {
      ...penalty.toJSON(),
      company,
      vehicle,
      timetable,
      location,
    };
  } catch (error: any) {
    console.error("Erro ao buscar dados:", error.message);
    return penalty; // Retorna o dado parcial se falhar
  }

};
