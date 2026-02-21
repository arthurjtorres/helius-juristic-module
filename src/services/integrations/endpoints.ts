export const registryRoutes = {
  // --- Rotas Individuais ---
  getCompanyGroupById: (id: string) => `/company-group/${id}`,
  getCorporationById: (id: string) => `/corporation/${id}`,
  getCompanyById: (id: string) => `/company/${id}`,
  getDepartmentById: (id: string) => `/department/${id}`,
  getSectorById: (id: string) => `/sector/${id}`,
  getPositionById: (id: string) => `/position/${id}`,
  getvehicleTypeById: (id: string) => `/vehicle-type/${id}`,
  getVehicleById: (id: string) => `/vehicle/${id}`,
  getLocationById: (id: string) => `/location/${id}`,
  getBusTimetableById: (id: string) => `/bus-timetable/${id}`,
  getPersonById: (id: string) => `/person/${id}`,
  getDocumentById: (id: string) => `/document/${id}`,
  getEmployeeById: (id: string) => `/employee/${id}`,  

  // --- Rotas em Lote ---
  getCompaniesBulk: `/company/bulk`,
  getVehiclesBulk: `/vehicle/bulk`,
  getLocationsBulk: `/location/bulk`,
  getBusTimetablesBulk: `/bus-timetable/bulk`,
  getEmployeesBulk: `/employee/bulk`,
  
};
