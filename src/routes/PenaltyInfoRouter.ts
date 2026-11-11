import { Router } from "express";
import PenaltyInfoController from "../controllers/PenaltyInfoController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const penaltyInfoRouter = Router();
const controller = new PenaltyInfoController();

penaltyInfoRouter.post("/", verifyToken, checkPermission("PENALIDADES", PermissionEnum.CREATE), controller.createPenalty.bind(controller));
penaltyInfoRouter.put("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.UPDATE), controller.updatePenalty.bind(controller));
penaltyInfoRouter.delete("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.DELETE), controller.deletePenalty.bind(controller));
penaltyInfoRouter.patch("/:id/reactivate", verifyToken, checkPermission("PENALIDADES", PermissionEnum.UPDATE), controller.reactivatePenalty.bind(controller));
penaltyInfoRouter.get("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.READ), controller.getPenalty.bind(controller));
penaltyInfoRouter.get("/", verifyToken, checkPermission("PENALIDADES", PermissionEnum.READ), controller.findPenalties.bind(controller));

export default penaltyInfoRouter;
