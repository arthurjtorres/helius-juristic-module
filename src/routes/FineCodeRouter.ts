import { Router } from "express";
import FineCodeController from "../controllers/FineCodeController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const fineCodeRouter = Router();
const controller = new FineCodeController();

fineCodeRouter.post("/", verifyToken, checkPermission("AUXILIARES", PermissionEnum.CREATE), controller.createFineCode.bind(controller));
fineCodeRouter.put("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.UPDATE), controller.updateFineCode.bind(controller));
fineCodeRouter.delete("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.DELETE), controller.deleteFineCode.bind(controller));
fineCodeRouter.patch("/:id/reactivate", verifyToken, checkPermission("AUXILIARES", PermissionEnum.UPDATE), controller.reactivateFineCode.bind(controller));
fineCodeRouter.get("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.READ), controller.getFineCode.bind(controller));
fineCodeRouter.get("/", verifyToken, checkPermission("AUXILIARES", PermissionEnum.READ), controller.findFineCode.bind(controller));

export default fineCodeRouter;
