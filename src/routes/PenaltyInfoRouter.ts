import { Router } from "express";
import PenaltyInfoController from "../controllers/PenaltyInfoController";
import { verifyToken } from "../middlewares/Authentication";

const penaltyInfoRouter = Router();
const controller = new PenaltyInfoController();

penaltyInfoRouter.post("/", verifyToken, controller.createPenalty.bind(controller));
penaltyInfoRouter.put("/:id", verifyToken, controller.updatePenalty.bind(controller));
penaltyInfoRouter.delete("/:id", verifyToken, controller.deletePenalty.bind(controller));
penaltyInfoRouter.patch("/:id/reactivate", verifyToken, controller.reactivatePenalty.bind(controller));
penaltyInfoRouter.get("/:id", verifyToken, controller.getPenalty.bind(controller));
penaltyInfoRouter.get("/", verifyToken, controller.findPenalties.bind(controller));

export default penaltyInfoRouter;
