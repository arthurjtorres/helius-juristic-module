import { DocTypeEnum } from "../models/enums/DocTypeEnum";
import { PenaltyStatusEnum } from "../models/enums/PenaltyStatusEnum";

export default interface PenaltyDocInterface {
  penaltyDocId?: string;
  penaltyDocType: DocTypeEnum;
  penaltyDocNumber: string;
  fkCtdopId: string;
  fkPenaltyInfoId: string;
  fkCorporationId?: string;
  penaltyDocStatus?: PenaltyStatusEnum;
  penaltyDocAnnotation?: string | null;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}
