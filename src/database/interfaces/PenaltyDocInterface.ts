import { DocTypeEnum } from "../models/enums/DocTypeEnum";

export default interface PenaltyDocInterface {
  penaltyDocId?: string;
  penaltyDocType: DocTypeEnum;
  penaltyDocRegistration: string;
  penaltyDocNumber: string;
  fkCtdopId: string;
  fkAppealId: string;
  fkPenaltyInfoId: string;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}