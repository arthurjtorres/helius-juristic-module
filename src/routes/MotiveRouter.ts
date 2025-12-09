import { Router } from "express";
import MotiveController from "../controllers/MotiveController";
const motiveRouter = Router();
const controller = new MotiveController();

motiveRouter.post("/", controller.createMotive.bind(controller));
motiveRouter.put("/:id", controller.updateMotive.bind(controller));
motiveRouter.delete("/:id", controller.deleteMotive.bind(controller));
motiveRouter.get("/:id", controller.getMotive.bind(controller));
motiveRouter.get("/", controller.findMotives.bind(controller));

export default motiveRouter;
