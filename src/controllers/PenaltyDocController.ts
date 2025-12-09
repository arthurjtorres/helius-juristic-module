import { Request, Response, NextFunction } from "express";
import PenaltyDocService from "../services/PenaltyDocService";

class PenaltyDocController {
  private service = new PenaltyDocService();

  async createPenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.createPenaltyDoc(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em createPenaltyDoc:", error);
      return res.status(500).json("Erro interno ao criar documento de penalidade.");
    }
  }

  async updatePenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.updatePenaltyDoc(id, req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em updatePenaltyDoc:", error);
      return res.status(500).json("Erro interno ao atualizar documento de penalidade.");
    }
  }

  async deletePenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deletePenaltyDoc(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em deletePenaltyDoc:", error);
      return res.status(500).json("Erro interno ao deletar documento de penalidade.");
    }
  }

  async getPenaltyDoc(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getPenaltyDoc(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em getPenaltyDoc:", error);
      return res.status(500).json("Erro interno ao buscar documento de penalidade.");
    }
  }

  async findPenaltyDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findPenaltyDocs(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em findPenaltyDocs:", error);
      return res.status(500).json("Erro interno ao buscar documentos de penalidade.");
    }
  }
}

export default PenaltyDocController;
