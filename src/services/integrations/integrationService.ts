import { axiosOperations, axiosRegistry } from "./axiosInstance";
import { operationsRoutes, registryRoutes } from "./endpoints";
import { logError } from "../../utils/logError";

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
    const response = await axiosRegistry.post(registryRoutes.getCompaniesLookup, { ids });
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
    const response = await axiosOperations.post(operationsRoutes.getVehiclesLookup, { ids });
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
    const response = await axiosOperations.post(operationsRoutes.getBusTimetablesLookup, { ids });
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
    const response = await axiosOperations.post(operationsRoutes.getLocationsLookup, { ids });
    return response.data?.data || [];
  } catch (error) {
    logError("getLocationsByIds", error);
    return [];
  }
};