import { Router } from "express";
import AnalysisController from "../controllers/AnalysisController";

const analysisRouter = Router();
const controller = new AnalysisController();

analysisRouter.post("/", controller.createAnalysis.bind(controller));
analysisRouter.put("/:id", controller.updateAnalysis.bind(controller));
analysisRouter.delete("/:id", controller.deleteAnalysis.bind(controller));
analysisRouter.get("/:id", controller.getAnalysis.bind(controller));
analysisRouter.get("/", controller.findAnalyses.bind(controller));

export default analysisRouter;
