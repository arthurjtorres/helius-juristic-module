import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import PenaltyInfoService from "../services/PenaltyInfoService";

class PenaltyController {
  private service = new PenaltyInfoService();

  async createPenalty(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createPenalty(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em createPenalty", error);
      const resp = Resp.internalError("Erro interno ao criar penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async updatePenalty(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updatePenalty(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em updatePenalty", error);
      const resp = Resp.internalError("Erro interno ao atualizar penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async deletePenalty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deletePenalty(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deletePenalty", error);
      const resp = Resp.internalError("Erro interno ao deletar penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivatePenalty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivatePenalty(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivatePenalty", error);
      const resp = Resp.internalError("Erro interno ao reativar penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async getPenalty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getPenalty(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getPenalty", error);
      const resp = Resp.internalError("Erro interno ao buscar penalidade.");
      return res.status(resp.status).json(resp);
    }
  }

  async findPenalties(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findPenalties(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findPenalties", error);
      const resp = Resp.internalError("Erro interno ao buscar penalidades.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default PenaltyController;
