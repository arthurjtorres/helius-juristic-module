import { Router } from "express";
import AppealController from "../controllers/AppealController";
import { verifyToken } from "./middlewares/Authentication";

const appealRouter = Router();
const controller = new AppealController();

appealRouter.post("/", verifyToken, controller.createAppeal.bind(controller));
appealRouter.put("/:id", verifyToken, controller.updateAppeal.bind(controller));
appealRouter.delete("/:id", verifyToken, controller.deleteAppeal.bind(controller));
appealRouter.get("/:id", controller.getAppeal.bind(controller));
appealRouter.get("/", controller.findAppeals.bind(controller));

export default appealRouter;