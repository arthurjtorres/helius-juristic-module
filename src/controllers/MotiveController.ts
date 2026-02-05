import { Request, Response, NextFunction } from "express";
import MotiveService from "../services/MotiveService";

class MotiveController {
  private service = new MotiveService();

  async createMotive(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createMotive(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em createMotive:", error);
      return res.status(500).json("Erro interno ao criar motivo.");
    }
  }

  async updateMotive(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updateMotive(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em updateMotive:", error);
      return res.status(500).json("Erro interno ao atualizar motivo.");
    }
  }

  async deleteMotive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteMotive(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em deleteMotive:", error);
      return res.status(500).json("Erro interno ao deletar motivo.");
    }
  }

  async getMotive(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getMotive(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em getMotive:", error);
      return res.status(500).json("Erro interno ao buscar motivo.");
    }
  }

  async findMotives(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findMotives(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em findMotives:", error);
      return res.status(500).json("Erro interno ao buscar motivos.");
    }
  }
}

export default MotiveController;
