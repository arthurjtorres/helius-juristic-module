export const registryRoutes = {
  // --- Rotas Individuais ---
  getCompanyGroupById: (id: string) => `/company-group/${id}`,
  getCorporationById: (id: string) => `/corporation/${id}`,
  getCompanyById: (id: string) => `/company/${id}`,
  getDepartmentById: (id: string) => `/department/${id}`,
  getSectorById: (id: string) => `/sector/${id}`,
  getPositionById: (id: string) => `/position/${id}`,  
  getPersonById: (id: string) => `/person/${id}`,
  getDocumentById: (id: string) => `/document/${id}`,
  getEmployeeById: (id: string) => `/employee/${id}`,  

  // --- Consulta por IDs (POST /lookup, T09). `/bulk` é reservada à inserção. ---
  getCompaniesLookup: `/company/lookup`,
  
};

export const operationsRoutes = {
  // --- Rotas Individuais ---
  getvehicleTypeById: (id: string) => `/vehicle-type/${id}`,
  getVehicleById: (id: string) => `/vehicle/${id}`,
  getLocationById: (id: string) => `/location/${id}`,
  getBusTimetableById: (id: string) => `/bus-timetable/${id}`,

  // --- Consulta por IDs (POST /lookup, T09). `/bulk` é reservada à inserção. ---
  getVehiclesLookup: `/vehicle/lookup`,
  getLocationsLookup: `/location/lookup`,
  getBusTimetablesLookup: `/bus-timetable/lookup`,
}
