import { Router } from "express";
import PenaltyViewController from "../controllers/PenaltyViewController";

const penaltyViewRouter = Router();
const controller = new PenaltyViewController();

penaltyViewRouter.get("/composite", controller.getCompositeData.bind(controller));

export default penaltyViewRouter;