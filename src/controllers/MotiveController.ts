import { Request, Response } from "express";
import { listQuery } from "../utils/ActiveFilter";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import MotiveService from "../services/MotiveService";

class MotiveController {
  private service = new MotiveService();

  async createMotive(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createMotive(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em createMotive", error);
      const resp = Resp.internalError("Erro interno ao criar motivo.");
      return res.status(resp.status).json(resp);
    }
  }

  async updateMotive(req: Request, res: Response) {
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
      logError("Erro em updateMotive", error);
      const resp = Resp.internalError("Erro interno ao atualizar motivo.");
      return res.status(resp.status).json(resp);
    }
  }

  async deleteMotive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteMotive(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deleteMotive", error);
      const resp = Resp.internalError("Erro interno ao deletar motivo.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivateMotive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivateMotive(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivateMotive", error);
      const resp = Resp.internalError("Erro interno ao reativar motivo.");
      return res.status(resp.status).json(resp);
    }
  }

  async getMotive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.getMotive(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getMotive", error);
      const resp = Resp.internalError("Erro interno ao buscar motivo.");
      return res.status(resp.status).json(resp);
    }
  }

  async findMotives(req: Request, res: Response) {
    try {
      const result = await this.service.findMotives(listQuery(req, res));
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findMotives", error);
      const resp = Resp.internalError("Erro interno ao buscar motivos.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default MotiveController;
