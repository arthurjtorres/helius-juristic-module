import { Router } from "express";
import CTDOPController from "../controllers/CTDOPController";
import { verifyToken } from "../middlewares/Authentication";

const ctdopRouter = Router();
const controller = new CTDOPController();

ctdopRouter.post("/", verifyToken, controller.createCTDOP.bind(controller));
ctdopRouter.put("/:id", verifyToken, controller.updateCTDOP.bind(controller));
ctdopRouter.delete("/:id", verifyToken, controller.deleteCTDOP.bind(controller));
ctdopRouter.patch("/:id/reactivate", verifyToken, controller.reactivateCTDOP.bind(controller));
ctdopRouter.get("/:id", verifyToken, controller.getCTDOP.bind(controller));
ctdopRouter.get("/", verifyToken, controller.findCTDOPs.bind(controller));

export default ctdopRouter;
