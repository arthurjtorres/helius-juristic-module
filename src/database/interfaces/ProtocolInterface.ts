import { DocTypeEnum } from "../models/enums/DocTypeEnum";

export default interface ProtocolInterface {
  protocolId?: string;
  protocolNumber: string;
  protocolDate: string;
  protocolType: DocTypeEnum;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}
