import { Request, Response } from "express";
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
      console.error("Erro em createCTDOP:", error);
      return res.status(500).json("Erro interno ao criar CTDOP.");
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
      console.error("Erro em updateCTDOP:", error);
      return res.status(500).json("Erro interno ao atualizar CTDOP.");
    }
  }

  async deleteCTDOP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.deleteCTDOP(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em deleteCTDOP:", error);
      return res.status(500).json("Erro interno ao deletar CTDOP.");
    }
  }

  async getCTDOP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.service.getCTDOP(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em getCTDOP:", error);
      return res.status(500).json("Erro interno ao buscar CTDOP.");
    }
  }

  async findCTDOPs(req: Request, res: Response) {
    try {
      const result = await this.service.findCTDOPs(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Erro em findCTDOPs:", error);
      return res.status(500).json("Erro interno ao buscar CTDOPs.");
    }
  }
}

export default CTDOPController;
