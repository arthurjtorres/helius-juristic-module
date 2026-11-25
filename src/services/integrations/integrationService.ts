import { axiosOperations, axiosRegistry } from "./axiosInstance";
import { operationsRoutes, registryRoutes } from "./endpoints";
import { logError } from "../../utils/logError";

/** Resposta das rotas `lookup` (só os campos que o juristic lê). */
type Lookup<T> = { data?: T[] };
type ExtCompany = { companyId: string; companyName: string; fkCorporationId?: string | null; Corporation?: { corporationAcronym: string } | null };
type ExtVehicle = { vehicleId: string; vehicleNumber: string };
type ExtBusTimetable = { busTimetableId: string; timetableCode: string };
type ExtLocation = { locationId: string; locationName: string };

export const getCompanyById = async (id: string) => {
  try {
    const response = await axiosRegistry.get(registryRoutes.getCompanyById(id));
    return response.data?.data || null;
  } catch (error: unknown) {
    logError("getCompanyById", error);
    return null;
  }
};

export const getCompaniesByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosRegistry.post<Lookup<ExtCompany>>(registryRoutes.getCompaniesLookup, { ids });
    return response.data?.data || [];
  } catch (error) {
    logError("getCompaniesByIds", error);
    return [];
  }
};

export const getVehicleById = async (id: string ) => {
  try {
    const response = await axiosOperations.get(operationsRoutes.getVehicleById(id));
    return response.data?.data || null;
  } catch (error: unknown) {
    logError("getVehicleById", error);
    return null;
  }
};

export const getVehiclesByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosOperations.post<Lookup<ExtVehicle>>(operationsRoutes.getVehiclesLookup, { ids });
    return response.data?.data || []; 
  } catch (error: unknown) {
    logError("getVehiclesByIds", error);
    return [];
  }
};

export const getBusTimetableById = async (id: string ) => {
  try {
    const response = await axiosOperations.get(operationsRoutes.getBusTimetableById(id));
    return response.data?.data || null;
  } catch (error: unknown) {
    logError("getBusTimetableById", error);
    return null;
  }
};

export const getBusTimetablesByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosOperations.post<Lookup<ExtBusTimetable>>(operationsRoutes.getBusTimetablesLookup, { ids });
    return response.data?.data || [];
  } catch (error) {
    logError("getBusTimetablesByIds", error);
    return [];
  }
};

export const getLocationById = async (id: string ) => {
  try {
    const response = await axiosOperations.get(operationsRoutes.getLocationById(id));
    return response.data?.data || null;
  } catch (error: unknown) {
    logError("getLocationById", error);
    return null;
  }
};

export const getLocationsByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosOperations.post<Lookup<ExtLocation>>(operationsRoutes.getLocationsLookup, { ids });
    return response.data?.data || [];
  } catch (error) {
    logError("getLocationsByIds", error);
    return [];
  }
};
/**
 * Consórcio (`fkCorporationId`) de uma empresa ativa, para gravar na penalidade.
 * Diferente das demais consultas, não engole o erro: se o `registry` falhar, a exceção sobe
 * e a gravação é abortada (500), em vez de tratar a empresa como inexistente.
 *
 * @param companyId Empresa (`registry.company`).
 * @returns `fkCorporationId` da empresa, ou `null` se ela não existe ou está inativa.
 */
export const getCompanyCorporationId = async (companyId: string): Promise<string | null> => {
  const response = await axiosRegistry.post<Lookup<ExtCompany>>(registryRoutes.getCompaniesLookup, { ids: [companyId] });
  const company = (response.data?.data || []).find((c) => c.companyId === companyId);
  return company?.fkCorporationId ?? null;
};
