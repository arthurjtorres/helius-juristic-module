import { Router } from "express";
import { verifyToken } from "../middlewares/Authentication";
import PenaltyViewController from "../controllers/PenaltyViewController";

const penaltyViewRouter = Router();
const controller = new PenaltyViewController();

penaltyViewRouter.get("/composite", verifyToken, controller.getCompositeData.bind(controller));

export default penaltyViewRouter;