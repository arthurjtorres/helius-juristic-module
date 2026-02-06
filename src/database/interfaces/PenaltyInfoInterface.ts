import { PenaltyStatusEnum } from "../models/enums/PenaltyStatusEnum"; 

export default interface PenaltyInfoInterface {
  penaltyId?: string;
  fkCompanyId: string;
  fkVehicleId: string;
  fkBusTimetableId: string;
  date: string;
  time: string;
  fkAgentId: string;
  fkFineCodeId: string;
  fkLocationId: string;
  agentAnnotation?: string;
  penaltyStatus: PenaltyStatusEnum;
  fkMotiveId: string;
  internalAnnotation?: string;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}