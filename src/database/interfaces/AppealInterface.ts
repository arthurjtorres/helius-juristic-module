import { AppealResponseEnum } from "../models/enums/AppealResponseEnum";

export default interface AppealInterface {
  appealId?: string;
  fkProtocolId: string;
  fkPenaltyDocId: string;
  response?: AppealResponseEnum | null;
  fkResponseCtdopId?: string | null;

  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  activated?: boolean;
}
