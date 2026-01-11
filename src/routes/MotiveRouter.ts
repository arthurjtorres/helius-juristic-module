import { Router } from "express";
import MotiveController from "../controllers/MotiveController";
import { verifyToken } from "./middlewares/Authentication";
const motiveRouter = Router();
const controller = new MotiveController();

motiveRouter.post("/", verifyToken, controller.createMotive.bind(controller));
motiveRouter.put("/:id", verifyToken, controller.updateMotive.bind(controller));
motiveRouter.delete("/:id", verifyToken, controller.deleteMotive.bind(controller));
motiveRouter.get("/:id", controller.getMotive.bind(controller));
motiveRouter.get("/", controller.findMotives.bind(controller));

export default motiveRouter;
