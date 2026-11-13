import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import AgentService from "../services/AgentService";

class AgentController {
  private service = new AgentService();

  async createAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createAgent(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em createAgent", error);
      const resp = Resp.internalError("Erro interno ao criar agente.");
      return res.status(resp.status).json(resp);
    }
  }

  async updateAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updateAgent(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em updateAgent", error);
      const resp = Resp.internalError("Erro interno ao atualizar agente.");
      return res.status(resp.status).json(resp);
    }
  }

  async deleteAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteAgent(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deleteAgent", error);
      const resp = Resp.internalError("Erro interno ao deletar agente.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivateAgent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivateAgent(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivateAgent", error);
      const resp = Resp.internalError("Erro interno ao reativar agente.");
      return res.status(resp.status).json(resp);
    }
  }

  async getAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getAgent(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getAgent", error);
      const resp = Resp.internalError("Erro interno ao buscar agente.");
      return res.status(resp.status).json(resp);
    }
  }

  async findAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findAgent(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findAgent", error);
      const resp = Resp.internalError("Erro interno ao buscar agentes.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default AgentController;
