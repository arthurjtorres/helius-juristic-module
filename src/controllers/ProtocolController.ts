import { Request, Response } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import ProtocolService from "../services/ProtocolService";

class ProtocolController {
  private service = new ProtocolService();

  async createProtocol(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createProtocol(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em createProtocol", error);
      const resp = Resp.internalError("Erro interno ao criar protocolo.");
      return res.status(resp.status).json(resp);
    }
  }

  async updateProtocol(req: Request, res: Response) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updateProtocol(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em updateProtocol", error);
      const resp = Resp.internalError("Erro interno ao atualizar protocolo.");
      return res.status(resp.status).json(resp);
    }
  }

  async deleteProtocol(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteProtocol(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deleteProtocol", error);
      const resp = Resp.internalError("Erro interno ao deletar protocolo.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivateProtocol(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivateProtocol(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivateProtocol", error);
      const resp = Resp.internalError("Erro interno ao reativar protocolo.");
      return res.status(resp.status).json(resp);
    }
  }

  async getProtocol(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.getProtocol(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getProtocol", error);
      const resp = Resp.internalError("Erro interno ao buscar protocolo.");
      return res.status(resp.status).json(resp);
    }
  }

  async findProtocols(req: Request, res: Response) {
    try {
      const result = await this.service.findProtocols(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findProtocols", error);
      const resp = Resp.internalError("Erro interno ao buscar protocolos.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default ProtocolController;