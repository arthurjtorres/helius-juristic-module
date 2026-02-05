import { Request, Response, NextFunction } from "express";
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
      console.error("Erro em createAnalysis:", error);
      return res.status(500).json("Erro interno ao criar análise.");
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
      console.error("Erro em updateAnalysis:", error);
      return res.status(500).json("Erro interno ao atualizar análise.");
    }
  }

  async deleteAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteAnalysis(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em deleteAnalysis:", error);
      return res.status(500).json("Erro interno ao deletar análise.");
    }
  }

  async getAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getAnalysis(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em getAnalysis:", error);
      return res.status(500).json("Erro interno ao buscar análise.");
    }
  }

  async findAnalyses(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findAnalyses(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em findAnalyses:", error);
      return res.status(500).json("Erro interno ao buscar análises.");
    }
  }
}

export default AnalysisController;
