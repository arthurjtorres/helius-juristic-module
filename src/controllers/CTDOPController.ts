import { Request, Response } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import CTDOPService from "../services/CTDOPService";

class CTDOPController {
  private service = new CTDOPService();

  async createCTDOP(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createCTDOP(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em createCTDOP", error);
      const resp = Resp.internalError("Erro interno ao criar CTDOP.");
      return res.status(resp.status).json(resp);
    }
  }

  async updateCTDOP(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updateCTDOP(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em updateCTDOP", error);
      const resp = Resp.internalError("Erro interno ao atualizar CTDOP.");
      return res.status(resp.status).json(resp);
    }
  }

  async deleteCTDOP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteCTDOP(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deleteCTDOP", error);
      const resp = Resp.internalError("Erro interno ao deletar CTDOP.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivateCTDOP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivateCTDOP(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivateCTDOP", error);
      const resp = Resp.internalError("Erro interno ao reativar ctdop.");
      return res.status(resp.status).json(resp);
    }
  }

  async getCTDOP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.getCTDOP(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getCTDOP", error);
      const resp = Resp.internalError("Erro interno ao buscar CTDOP.");
      return res.status(resp.status).json(resp);
    }
  }

  async findCTDOPs(req: Request, res: Response) {
    try {
      const result = await this.service.findCTDOPs(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findCTDOPs", error);
      const resp = Resp.internalError("Erro interno ao buscar CTDOPs.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default CTDOPController;
