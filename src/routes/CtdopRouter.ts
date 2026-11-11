import { Router } from "express";
import CTDOPController from "../controllers/CTDOPController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const ctdopRouter = Router();
const controller = new CTDOPController();

ctdopRouter.post("/", verifyToken, checkPermission("PENALIDADES", PermissionEnum.CREATE), controller.createCTDOP.bind(controller));
ctdopRouter.put("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.UPDATE), controller.updateCTDOP.bind(controller));
ctdopRouter.delete("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.DELETE), controller.deleteCTDOP.bind(controller));
ctdopRouter.patch("/:id/reactivate", verifyToken, checkPermission("PENALIDADES", PermissionEnum.UPDATE), controller.reactivateCTDOP.bind(controller));
ctdopRouter.get("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.READ), controller.getCTDOP.bind(controller));
ctdopRouter.get("/", verifyToken, checkPermission("PENALIDADES", PermissionEnum.READ), controller.findCTDOPs.bind(controller));

export default ctdopRouter;
