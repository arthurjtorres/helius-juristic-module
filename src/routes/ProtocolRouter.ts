import { Router } from "express";
import ProtocolController from "../controllers/ProtocolController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const protocolRouter = Router();
const controller = new ProtocolController();

protocolRouter.post("/", verifyToken, checkPermission("RECURSOS", PermissionEnum.CREATE), controller.createProtocol.bind(controller));
protocolRouter.put("/:id", verifyToken, checkPermission("RECURSOS", PermissionEnum.UPDATE), controller.updateProtocol.bind(controller));
protocolRouter.delete("/:id", verifyToken, checkPermission("RECURSOS", PermissionEnum.DELETE), controller.deleteProtocol.bind(controller));
protocolRouter.patch("/:id/reactivate", verifyToken, checkPermission("RECURSOS", PermissionEnum.UPDATE), controller.reactivateProtocol.bind(controller));
protocolRouter.get("/:id", verifyToken, checkPermission("RECURSOS", PermissionEnum.READ), controller.getProtocol.bind(controller));
protocolRouter.get("/", verifyToken, checkPermission("RECURSOS", PermissionEnum.READ), controller.findProtocols.bind(controller));

export default protocolRouter;