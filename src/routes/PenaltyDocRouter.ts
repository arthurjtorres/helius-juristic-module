import { Router } from "express";
import PenaltyDocController from "../controllers/PenaltyDocController";
import { verifyToken } from "../middlewares/Authentication";

const penaltyDocRouter = Router();
const controller = new PenaltyDocController();

penaltyDocRouter.post("/", verifyToken, controller.createPenaltyDoc.bind(controller));
penaltyDocRouter.put("/:id", verifyToken, controller.updatePenaltyDoc.bind(controller));
penaltyDocRouter.delete("/:id", verifyToken, controller.deletePenaltyDoc.bind(controller));
penaltyDocRouter.patch("/:id/reactivate", verifyToken, controller.reactivatePenaltyDoc.bind(controller));
penaltyDocRouter.get("/:id", verifyToken, controller.getPenaltyDoc.bind(controller));
penaltyDocRouter.get("/", verifyToken, controller.findPenaltyDocs.bind(controller));

export default penaltyDocRouter;
