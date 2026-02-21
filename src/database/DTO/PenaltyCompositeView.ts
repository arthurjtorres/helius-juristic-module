export default interface PenaltyCompositeView {
  
  // Dados do PenaltyDoc (O Conector)
  docId: string;
  docRegistration?: string; // ex: AS28780
  docType?: string;

  // Dados do PenaltyInfo (O Evento)
  fkCompanyId?: string;     // fkCompanyId
  company?: string;

  fkVehicleId?: string;   // ou a Placa, se o backend já popular (recomendado)
  vehicleNumber?: string;
  
  fkBusTimetableId?: string;   //linha
  busTimetableCode?: string;

  penaltyDate?: string; // date + time combinados

  fkAgentId?: string;    //Agente
  agentCode?: string;

  fineCodeId?: string;    // fkFineCodeId ou o código real
  fineCodeNumber?: string;

  fkLocationId?: string;    // fkLocationId ou nome da rua
  location?: string;

  agentAnnotation?: string;

  fkMotiveId?: string;
  motive?: string;
  
  internalAnnotation?: string;
  penaltyStatus?: string;
  
  // Dados do CTDOP (O Documento de Lote)
  ctdopNumber?: string;
  ctdopPeriod?: string; // decêndio (1|2|3)
  
  // Dados do Appeal (O Recurso - opcional, pois pode ser null)
  appealProtocol?: string;
  appealStatus?: string;
}