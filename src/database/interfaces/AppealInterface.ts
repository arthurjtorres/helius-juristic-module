// Interface: AppealInterface.ts
import { DocTypeEnum } from "../models/enums/DocTypeEnum";

export default interface AppealInterface {
  appealId?: string;
  appealType: DocTypeEnum;
  protocolNumber: string;
  protocolDate: string;
  response?: string;
  responseDate?: string;
  responseCtdop?: string;
}