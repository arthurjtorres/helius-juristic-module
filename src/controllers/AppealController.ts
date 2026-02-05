import { Request, Response } from "express";
import AppealService from "../services/AppealService";

class AppealController {
  private service = new AppealService();

  async createAppeal(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createAppeal(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em createAppeal:", error);
      return res.status(500).json("Erro interno ao criar recurso.");
    }
  }

  async updateAppeal(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updateAppeal(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em updateAppeal:", error);
      return res.status(500).json("Erro interno ao atualizar recurso.");
    }
  }

  async deleteAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteAppeal(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em deleteAppeal:", error);
      return res.status(500).json("Erro interno ao deletar recurso.");
    }
  }

  async getAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.getAppeal(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em getAppeal:", error);
      return res.status(500).json("Erro interno ao buscar recurso.");
    }
  }

  async findAppeals(req: Request, res: Response) {
    try {
      const result = await this.service.findAppeals(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em findAppeals:", error);
      return res.status(500).json("Erro interno ao buscar recursos.");
    }
  }
}

export default AppealController;