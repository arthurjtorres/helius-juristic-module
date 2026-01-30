import { Router } from "express";
import AnalysisController from "../controllers/AnalysisController";
import { verifyToken } from "../middlewares/Authentication";

const analysisRouter = Router();
const controller = new AnalysisController();

analysisRouter.post("/", verifyToken, controller.createAnalysis.bind(controller));
analysisRouter.put("/:id", verifyToken, controller.updateAnalysis.bind(controller));
analysisRouter.delete("/:id", verifyToken, controller.deleteAnalysis.bind(controller));
analysisRouter.get("/:id", controller.getAnalysis.bind(controller));
analysisRouter.get("/", controller.findAnalyses.bind(controller));

export default analysisRouter;
