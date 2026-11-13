import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import PenaltyDocService from "../services/PenaltyDocService";

class PenaltyDocController {
  private service = new PenaltyDocService();

  async createPenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createPenaltyDoc(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em createPenaltyDoc", error);
      const resp = Resp.internalError("Erro interno ao criar documento de penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async updatePenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updatePenaltyDoc(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em updatePenaltyDoc", error);
      const resp = Resp.internalError("Erro interno ao atualizar documento de penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async deletePenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deletePenaltyDoc(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deletePenaltyDoc", error);
      const resp = Resp.internalError("Erro interno ao deletar documento de penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivatePenaltyDoc(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivatePenaltyDoc(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivatePenaltyDoc", error);
      const resp = Resp.internalError("Erro interno ao reativar documento de penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async getPenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getPenaltyDoc(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getPenaltyDoc", error);
      const resp = Resp.internalError("Erro interno ao buscar documento de penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async findPenaltyDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findPenaltyDocs(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findPenaltyDocs", error);
      const resp = Resp.internalError("Erro interno ao buscar documentos de penalidade.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default PenaltyDocController;
