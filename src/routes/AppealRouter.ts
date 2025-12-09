import { Router } from "express";
import AppealController from "../controllers/AppealController";

const appealRouter = Router();
const controller = new AppealController();

appealRouter.post("/", controller.createAppeal.bind(controller));
appealRouter.put("/:id", controller.updateAppeal.bind(controller));
appealRouter.delete("/:id", controller.deleteAppeal.bind(controller));
appealRouter.get("/:id", controller.getAppeal.bind(controller));
appealRouter.get("/", controller.findAppeals.bind(controller));

export default appealRouter;