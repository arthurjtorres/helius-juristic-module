import { Router } from "express";
import AgentController from "../controllers/AgentController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const agentRouter = Router();
const controller = new AgentController();

agentRouter.post("/", verifyToken, checkPermission("AUXILIARES", PermissionEnum.CREATE), controller.createAgent.bind(controller));
agentRouter.put("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.UPDATE), controller.updateAgent.bind(controller));
agentRouter.delete("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.DELETE), controller.deleteAgent.bind(controller));
agentRouter.patch("/:id/reactivate", verifyToken, checkPermission("AUXILIARES", PermissionEnum.UPDATE), controller.reactivateAgent.bind(controller));
agentRouter.get("/:id", verifyToken, checkPermission("AUXILIARES", PermissionEnum.READ), controller.getAgent.bind(controller));
agentRouter.get("/", verifyToken, checkPermission("AUXILIARES", PermissionEnum.READ), controller.findAgent.bind(controller));

export default agentRouter;
