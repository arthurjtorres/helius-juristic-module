import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/logError";
import Resp from "../utils/Response";
import AnalysisService from "../services/AnalysisService";

class AnalysisController {
  private service = new AnalysisService();

  async createAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        createdBy: user.userId
      }

      const result = await this.service.createAnalysis(data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em createAnalysis", error);
      const resp = Resp.internalError("Erro interno ao criar análise.");
      return res.status(resp.status).json(resp);
    }
  }

  async updateAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const data = {
        ...req.body, 
        updatedBy: user.userId
      }

      const { id } = req.params;
      const result = await this.service.updateAnalysis(id, data);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em updateAnalysis", error);
      const resp = Resp.internalError("Erro interno ao atualizar análise.");
      return res.status(resp.status).json(resp);
    }
  }

  async deleteAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteAnalysis(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em deleteAnalysis", error);
      const resp = Resp.internalError("Erro interno ao deletar análise.");
      return res.status(resp.status).json(resp);
    }
  }

  async reactivateAnalysis(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.reactivateAnalysis(id, res.locals.user.userId);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em reactivateAnalysis", error);
      const resp = Resp.internalError("Erro interno ao reativar análise.");
      return res.status(resp.status).json(resp);
    }
  }

  async getAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getAnalysis(id);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em getAnalysis", error);
      const resp = Resp.internalError("Erro interno ao buscar análise.");
      return res.status(resp.status).json(resp);
    }
  }

  async findAnalyses(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findAnalyses(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      logError("Erro em findAnalyses", error);
      const resp = Resp.internalError("Erro interno ao buscar análises.");
      return res.status(resp.status).json(resp);
    }
  }
}

export default AnalysisController;
