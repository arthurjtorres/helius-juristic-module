import { Router } from "express";
import MotiveController from "../controllers/MotiveController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";
const motiveRouter = Router();
const controller = new MotiveController();

motiveRouter.post("/", verifyToken, checkPermission("AUXILIARES", PermissionEnum.CREATE), controller.createMotive.bind(controller));
motiveRouter.put("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.UPDATE), controller.updateMotive.bind(controller));
motiveRouter.delete("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.DELETE), controller.deleteMotive.bind(controller));
motiveRouter.patch("/:id/reactivate", verifyToken, checkPermission("AUXILIARES", PermissionEnum.UPDATE), controller.reactivateMotive.bind(controller));
motiveRouter.get("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.READ), controller.getMotive.bind(controller));
motiveRouter.get("/", verifyToken, checkPermission("AUXILIARES", PermissionEnum.READ), controller.findMotives.bind(controller));

export default motiveRouter;
