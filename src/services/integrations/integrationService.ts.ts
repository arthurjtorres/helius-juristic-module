import { axiosRegistry } from "./axiosInstance";
import { registryRoutes } from "./endpoints";

export const getCompanyById = async (id: string) => {
  try {
    const response = await axiosRegistry.get(registryRoutes.getCompanyById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar a empresa ${id}:`, error.message);
    return null;
  }
};

export const getVehicleById = async (id: string ) => {
  try {
    const response = await axiosRegistry.get(registryRoutes.getVehicleById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar o veículo ${id}`, error.message);
    return null;
  }
};

export const getBusTimetableById = async (id: string ) => {
  try {
    const response = await axiosRegistry.get(registryRoutes.getBusTimetableById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar o itinerário ${id}`, error.message);
    return null;
  }
};

export const getLocationById = async (id: string ) => {
  try {
    const response = await axiosRegistry.get(registryRoutes.getLocationById(id));
    return response.data?.data || null;
  } catch (error: any) {
    console.error(`Erro ao buscar o veículo ${id}`, error.message);
    return null;
  }
};

