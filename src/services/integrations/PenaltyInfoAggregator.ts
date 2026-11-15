import { getBusTimetableById, getCompanyById, getLocationById, getVehicleById } from "./integrationService";
import PenaltyInfoModel from "../../database/models/PenaltyInfoModel";
import { logError } from "../../utils/logError";

/** Só consulta o outro módulo quando a referência existe (veículo, linha e local são opcionais). */
const fetchIf = <T>(id: string | null | undefined, fn: (id: string) => Promise<T>) =>
  id ? fn(id) : Promise.resolve(null);

export const buildPenaltyInfoView = async (penalty: PenaltyInfoModel) => {
  try {
    const [company, vehicle, timetable, location] = await Promise.all([
      fetchIf(penalty.fkCompanyId, getCompanyById),
      fetchIf(penalty.fkVehicleId, getVehicleById),
      fetchIf(penalty.fkBusTimetableId, getBusTimetableById),
      fetchIf(penalty.fkLocationId, getLocationById),
    ]);

    return {
      ...penalty.toJSON(),
      company,
      vehicle,
      timetable,
      location,
    };
  } catch (error: unknown) {
    logError("buildPenaltyInfoView", error);
    return penalty; // Retorna o dado parcial se falhar
  }

};
