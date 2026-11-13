import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import FineCodeService from "../services/FineCodeService";

class FineCodeController {
  private service = new FineCodeService();

  async createFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createFineCode(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em create FineCode", error);
      const resp = Resp.internalError("Erro interno ao criar código de infração.");
      return res.status(resp.status).json(resp);
    }
  }

  async updateFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updateFineCode(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em update FineCode", error);
      const resp = Resp.internalError("Erro interno ao atualizar código de infração.");
      return res.status(resp.status).json(resp);
    }
  }

  async deleteFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteFineCode(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em delete FineCode", error);
      const resp = Resp.internalError("Erro interno ao deletar código de infração.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivateFineCode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivateFineCode(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivateFineCode", error);
      const resp = Resp.internalError("Erro interno ao reativar código de infração.");
      return res.status(resp.status).json(resp);
    }
  }

  async getFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getFineCode(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em get FineCode", error);
      const resp = Resp.internalError("Erro interno ao buscar código de infração.");
      return res.status(resp.status).json(resp);
    }
  }

  async findFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findFineCode(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em find FineCode", error);
      const resp = Resp.internalError("Erro interno ao buscar códigos de infração.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default FineCodeController;
