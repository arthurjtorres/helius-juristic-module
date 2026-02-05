import { Request, Response, NextFunction } from "express";
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
      console.error("Erro em createPenalty:", error);
      return res.status(500).json("Erro interno ao criar penalidade.");
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
      console.error("Erro em updatePenalty:", error);
      return res.status(500).json("Erro interno ao atualizar penalidade.");
    }
  }

  async deletePenalty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deletePenalty(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em deletePenalty:", error);
      return res.status(500).json("Erro interno ao deletar penalidade.");
    }
  }

  async getPenalty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getPenalty(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em getPenalty:", error);
      return res.status(500).json("Erro interno ao buscar penalidade.");
    }
  }

  async findPenalties(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findPenalties(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em findPenalties:", error);
      return res.status(500).json("Erro interno ao buscar penalidades.");
    }
  }
}

export default PenaltyController;
