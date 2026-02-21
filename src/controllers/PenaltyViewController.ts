import { Request, Response as ExpressResponse, NextFunction } from "express";
import { PenaltyViewService } from "../services/PenaltyViewService";
import Response from "../utils/Response";

class PenaltyViewController {
  private service = new PenaltyViewService();

  async getCompositeData(req: Request, res: ExpressResponse, next: NextFunction) {
    try {
      
      const result = await this.service.getCompositeTableData();
      
      return res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Erro em getCompositeData:", error);
     const errorResponse = Response.internalError("Erro interno ao montar a visão composta das penalidades.");
      return res.status(errorResponse.status).json(errorResponse);
    }
  }
}

export default PenaltyViewController;