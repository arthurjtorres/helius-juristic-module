import { Router } from "express";
import AppealController from "../controllers/AppealController";
import { verifyToken } from "../middlewares/Authentication";

const appealRouter = Router();
const controller = new AppealController();

appealRouter.post("/", verifyToken, controller.createAppeal.bind(controller));
appealRouter.put("/:id", verifyToken, controller.updateAppeal.bind(controller));
appealRouter.delete("/:id", verifyToken, controller.deleteAppeal.bind(controller));
appealRouter.patch("/:id/reactivate", verifyToken, controller.reactivateAppeal.bind(controller));
appealRouter.get("/:id", verifyToken, controller.getAppeal.bind(controller));
appealRouter.get("/", verifyToken, controller.findAppeals.bind(controller));

export default appealRouter;