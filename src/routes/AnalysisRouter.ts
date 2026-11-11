import { Router } from "express";
import AnalysisController from "../controllers/AnalysisController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const analysisRouter = Router();
const controller = new AnalysisController();

analysisRouter.post("/", verifyToken, checkPermission("ANALISES", PermissionEnum.CREATE), controller.createAnalysis.bind(controller));
analysisRouter.put("/:id", verifyToken, checkPermission("ANALISES", PermissionEnum.UPDATE), controller.updateAnalysis.bind(controller));
analysisRouter.delete("/:id", verifyToken, checkPermission("ANALISES", PermissionEnum.DELETE), controller.deleteAnalysis.bind(controller));
analysisRouter.patch("/:id/reactivate", verifyToken, checkPermission("ANALISES", PermissionEnum.UPDATE), controller.reactivateAnalysis.bind(controller));
analysisRouter.get("/:id", verifyToken, checkPermission("ANALISES", PermissionEnum.READ, { allowServiceToken: false }), controller.getAnalysis.bind(controller));
analysisRouter.get("/", verifyToken, checkPermission("ANALISES", PermissionEnum.READ, { allowServiceToken: false }), controller.findAnalyses.bind(controller));

export default analysisRouter;
