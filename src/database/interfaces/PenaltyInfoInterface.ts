export default interface PenaltyInfoInterface {
  penaltyInfoId?: string;
  fkCompanyId: string;
  fkCorporationId?: string;
  fkVehicleId?: string | null;
  fkBusTimetableId?: string | null;
  date: string;
  time: string;
  fkAgentId?: string | null;
  fkFineCodeId?: string | null;
  fkLocationId?: string | null;
  agentAnnotation?: string | null;
  fkMotiveId?: string | null;
  internalAnnotation?: string | null;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}
