import { Router } from "express";
import PenaltyDocController from "../controllers/PenaltyDocController";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";

const penaltyDocRouter = Router();
const controller = new PenaltyDocController();

penaltyDocRouter.post("/", verifyToken, checkPermission("PENALIDADES", PermissionEnum.CREATE), controller.createPenaltyDoc.bind(controller));
penaltyDocRouter.put("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.UPDATE), controller.updatePenaltyDoc.bind(controller));
penaltyDocRouter.delete("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.DELETE), controller.deletePenaltyDoc.bind(controller));
penaltyDocRouter.patch("/:id/reactivate", verifyToken, checkPermission("PENALIDADES", PermissionEnum.UPDATE), controller.reactivatePenaltyDoc.bind(controller));
penaltyDocRouter.get("/:id", verifyToken, checkPermission("PENALIDADES", PermissionEnum.READ), controller.getPenaltyDoc.bind(controller));
penaltyDocRouter.get("/", verifyToken, checkPermission("PENALIDADES", PermissionEnum.READ), controller.findPenaltyDocs.bind(controller));

export default penaltyDocRouter;
