import { axiosRegistry } from "./axiosInstance";
import { operationsRoutes, registryRoutes } from "./endpoints";

export const getCompanyById = async (id: string) => {
  try {
    const response = await axiosRegistry.get(registryRoutes.getCompanyById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar a empresa ${id}:`, error.message);
    return null;
  }
};

export const getCompaniesByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosRegistry.post(operationsRoutes.getCompaniesBulk, { ids });
    return response.data?.data || [];
  } catch (error) {
    console.error("Erro ao procurar empresas em lote:", error);
    return [];
  }
};

export const getVehicleById = async (id: string ) => {
  try {
    const response = await axiosRegistry.get(operationsRoutes.getVehicleById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar o veículo ${id}`, error.message);
    return null;
  }
};

export const getVehiclesByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosRegistry.post(operationsRoutes.getVehiclesBulk, { ids });
    return response.data?.data || []; 
  } catch (error: any) {
    console.error(`Erro na busca em lote de veículos:`, error.message);
    return [];
  }
};

export const getBusTimetableById = async (id: string ) => {
  try {
    const response = await axiosRegistry.get(operationsRoutes.getBusTimetableById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar o itinerário ${id}`, error.message);
    return null;
  }
};

export const getBusTimetablesByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosRegistry.post(operationsRoutes.getBusTimetablesBulk, { ids });
    return response.data?.data || [];
  } catch (error) {
    console.error("Erro ao procurar itinerários em lote:", error);
    return [];
  }
};

export const getLocationById = async (id: string ) => {
  try {
    const response = await axiosRegistry.get(operationsRoutes.getLocationById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar o veículo ${id}`, error.message);
    return null;
  }
};

export const getLocationsByIds = async (ids: string[]) => {
  if (!ids.length) return [];
  try {
    const response = await axiosRegistry.post(operationsRoutes.getLocationsBulk, { ids });
    return response.data?.data || [];
  } catch (error) {
    console.error("Erro ao procurar locais em lote:", error);
    return [];
  }
};