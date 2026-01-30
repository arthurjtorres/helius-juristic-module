import { Router } from "express";
import PenaltyDocController from "../controllers/PenaltyDocController";
import { verifyToken } from "../middlewares/Authentication";

const penaltyDocRouter = Router();
const controller = new PenaltyDocController();

penaltyDocRouter.post("/", verifyToken, controller.createPenaltyDoc.bind(controller));
penaltyDocRouter.put("/:id", verifyToken, controller.updatePenaltyDoc.bind(controller));
penaltyDocRouter.delete("/:id", verifyToken, controller.deletePenaltyDoc.bind(controller));
penaltyDocRouter.get("/:id", controller.getPenaltyDoc.bind(controller));
penaltyDocRouter.get("/", controller.findPenaltyDocs.bind(controller));

export default penaltyDocRouter;
