import { Router } from "express";
import AppealController from "../controllers/AppealController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const appealRouter = Router();
const controller = new AppealController();

appealRouter.post("/", verifyToken, checkPermission("RECURSOS", PermissionEnum.CREATE), controller.createAppeal.bind(controller));
appealRouter.put("/:id", verifyToken, checkPermission("RECURSOS", PermissionEnum.UPDATE), controller.updateAppeal.bind(controller));
appealRouter.delete("/:id", verifyToken, checkPermission("RECURSOS", PermissionEnum.DELETE), controller.deleteAppeal.bind(controller));
appealRouter.patch("/:id/reactivate", verifyToken, checkPermission("RECURSOS", PermissionEnum.UPDATE), controller.reactivateAppeal.bind(controller));
appealRouter.get("/:id", verifyToken, checkPermission("RECURSOS", PermissionEnum.READ), controller.getAppeal.bind(controller));
appealRouter.get("/", verifyToken, checkPermission("RECURSOS", PermissionEnum.READ), controller.findAppeals.bind(controller));

export default appealRouter;