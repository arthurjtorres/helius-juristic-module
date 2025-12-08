import { DocTypeEnum } from "../models/enums/DocTypeEnum";

export default interface CTDOPInterface {
  ctdopId?: string;
  ctdopNumber: string;
  receiveDate?: string;
  docType: DocTypeEnum;
  responseDate?: string;
  refMonth: string;
  period: string;
  refYear: number;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}