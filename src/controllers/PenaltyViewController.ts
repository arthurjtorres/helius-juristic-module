import { Request, Response as ExpressResponse } from "express";
import { PenaltyViewService } from "../services/PenaltyViewService";
import Response from "../utils/Response";
import { logError } from "../utils/logError";
import { listQuery } from "../utils/ActiveFilter";

class PenaltyViewController {
  private service = new PenaltyViewService();

  async getCompositeData(req: Request, res: ExpressResponse) {
    try {
      const result = await this.service.getCompositeTableData(listQuery(req, res));
      return res.status(result.status).json(result);
    } catch (error: unknown) {
      logError("getCompositeData", error);
      const errorResponse = Response.internalError("Erro interno ao montar a visão composta das penalidades.");
      return res.status(errorResponse.status).json(errorResponse);
    }
  }
}

export default PenaltyViewController;