import { Router } from "express";
import { verifyToken } from "../middlewares/Authentication";
import { checkPermission } from "../middlewares/CheckPermission";
import { PermissionEnum } from "../database/models/enums/PermissionEnum";
import PenaltyViewController from "../controllers/PenaltyViewController";

const penaltyViewRouter = Router();
const controller = new PenaltyViewController();

penaltyViewRouter.get("/composite", verifyToken, checkPermission("PENALIDADES", PermissionEnum.READ), controller.getCompositeData.bind(controller));

export default penaltyViewRouter;