import { Router } from "express";
import AnalysisController from "../controllers/AnalysisController";
import { verifyToken } from "../middlewares/Authentication";

const analysisRouter = Router();
const controller = new AnalysisController();

analysisRouter.post("/", verifyToken, controller.createAnalysis.bind(controller));
analysisRouter.put("/:id", verifyToken, controller.updateAnalysis.bind(controller));
analysisRouter.delete("/:id", verifyToken, controller.deleteAnalysis.bind(controller));
analysisRouter.patch("/:id/reactivate", verifyToken, controller.reactivateAnalysis.bind(controller));
analysisRouter.get("/:id", verifyToken, controller.getAnalysis.bind(controller));
analysisRouter.get("/", verifyToken, controller.findAnalyses.bind(controller));

export default analysisRouter;
