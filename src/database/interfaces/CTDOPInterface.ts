import { CtdopTypeEnum } from "../models/enums/CtdopTypeEnum";

export default interface CTDOPInterface {
  ctdopId?: string;
  ctdopNumber?: string | null;
  receiveDate?: string | null;
  docType: CtdopTypeEnum;
  responseDeadline?: string | null;
  refMonth?: number | null;
  period?: number | null;
  refYear?: number | null;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}
