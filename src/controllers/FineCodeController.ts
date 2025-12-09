import { Request, Response, NextFunction } from "express";
import FineCodeService from "../services/FineCodeService";

class FineCodeController {
  private service = new FineCodeService();

  async createFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.createFineCode(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em create FineCode:", error);
      return res.status(500).json("Erro interno ao criar código de infração.");
    }
  }

  async updateFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.updateFineCode(id, req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em update FineCode:", error);
      return res.status(500).json("Erro interno ao atualizar código de infração.");
    }
  }

  async deleteFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteFineCode(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em delete FineCode:", error);
      return res.status(500).json("Erro interno ao deletar código de infração.");
    }
  }

  async getFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.service.getFineCode(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em get FineCode:", error);
      return res.status(500).json("Erro interno ao buscar código de infração.");
    }
  }

  async findFineCode(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findFineCode(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em find FineCode:", error);
      return res.status(500).json("Erro interno ao buscar códigos de infração.");
    }
  }
}

export default FineCodeController;
