import { Router } from "express";
import CTDOPController from "../controllers/CTDOPController";
import { verifyToken } from "../middlewares/Authentication";

const ctdopRouter = Router();
const controller = new CTDOPController();

ctdopRouter.post("/", verifyToken, controller.createCTDOP.bind(controller));
ctdopRouter.put("/:id", verifyToken, controller.updateCTDOP.bind(controller));
ctdopRouter.delete("/:id", verifyToken, controller.deleteCTDOP.bind(controller));
ctdopRouter.get("/:id", controller.getCTDOP.bind(controller));
ctdopRouter.get("/", controller.findCTDOPs.bind(controller));

export default ctdopRouter;
