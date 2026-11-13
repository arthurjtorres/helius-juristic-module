import { Request, Response } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
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
      logError("Erro em createAppeal", error);
      const resp = Resp.internalError("Erro interno ao criar recurso.");
      return res.status(resp.status).json(resp);
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
      logError("Erro em updateAppeal", error);
      const resp = Resp.internalError("Erro interno ao atualizar recurso.");
      return res.status(resp.status).json(resp);
    }
  }

  async deleteAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteAppeal(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deleteAppeal", error);
      const resp = Resp.internalError("Erro interno ao deletar recurso.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivateAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivateAppeal(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivateAppeal", error);
      const resp = Resp.internalError("Erro interno ao reativar recurso.");
      return res.status(resp.status).json(resp);
    }
  }

  async getAppeal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.getAppeal(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getAppeal", error);
      const resp = Resp.internalError("Erro interno ao buscar recurso.");
      return res.status(resp.status).json(resp);
    }
  }

  async findAppeals(req: Request, res: Response) {
    try {
      const result = await this.service.findAppeals(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findAppeals", error);
      const resp = Resp.internalError("Erro interno ao buscar recursos.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default AppealController;