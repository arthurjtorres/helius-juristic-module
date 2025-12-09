import { Router } from "express";
import CTDOPController from "../controllers/CTDOPController";

const ctdopRouter = Router();
const controller = new CTDOPController();

ctdopRouter.post("/", controller.createCTDOP.bind(controller));
ctdopRouter.put("/:id", controller.updateCTDOP.bind(controller));
ctdopRouter.delete("/:id", controller.deleteCTDOP.bind(controller));
ctdopRouter.get("/:id", controller.getCTDOP.bind(controller));
ctdopRouter.get("/", controller.findCTDOPs.bind(controller));

export default ctdopRouter;
