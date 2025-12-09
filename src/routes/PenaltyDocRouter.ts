import { Router } from "express";
import PenaltyDocController from "../controllers/PenaltyDocController";

const penaltyDocRouter = Router();
const controller = new PenaltyDocController();

penaltyDocRouter.post("/", controller.createPenaltyDoc.bind(controller));
penaltyDocRouter.put("/:id", controller.updatePenaltyDoc.bind(controller));
penaltyDocRouter.delete("/:id", controller.deletePenaltyDoc.bind(controller));
penaltyDocRouter.get("/:id", controller.getPenaltyDoc.bind(controller));
penaltyDocRouter.get("/", controller.findPenaltyDocs.bind(controller));

export default penaltyDocRouter;
