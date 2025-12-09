import { Router } from "express";
import PenaltyInfoController from "../controllers/PenaltyInfoController";

const penaltyInfoRouter = Router();
const controller = new PenaltyInfoController();

penaltyInfoRouter.post("/", controller.createPenalty.bind(controller));
penaltyInfoRouter.put("/:id", controller.updatePenalty.bind(controller));
penaltyInfoRouter.delete("/:id", controller.deletePenalty.bind(controller));
penaltyInfoRouter.get("/:id", controller.getPenalty.bind(controller));
penaltyInfoRouter.get("/", controller.findPenalties.bind(controller));

export default penaltyInfoRouter;
