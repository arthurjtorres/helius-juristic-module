import { Request, Response, NextFunction } from "express";
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
      console.error("Erro em createAgent:", error);
      return res.status(500).json("Erro interno ao criar agente.");
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
      console.error("Erro em updateAgent:", error);
      return res.status(500).json("Erro interno ao atualizar agente.");
    }
  }

  async deleteAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteAgent(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em deleteAgent:", error);
      return res.status(500).json("Erro interno ao deletar agente.");
    }
  }

  async getAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getAgent(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em getAgent:", error);
      return res.status(500).json("Erro interno ao buscar agente.");
    }
  }

  async findAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findAgent(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em findAgent:", error);
      return res.status(500).json("Erro interno ao buscar agentes.");
    }
  }
}

export default AgentController;
