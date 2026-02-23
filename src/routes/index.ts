import { Router } from "express";
import fineCodeRouter from "./FineCodeRouter";
import motiveRouter from "./MotiveRouter";
import agentRouter from "./AgentRouter";
import appealRouter from "./AppealRouter";
import ctdopRouter from "./CtdopRouter";
import penaltyInfoRouter from "./PenaltyInfoRouter";
import penaltyDocRouter from "./PenaltyDocRouter";
import penaltyViewRouter from "./penaltyViewRouter";

const router = Router();

router.use("/agent", agentRouter)
router.use("/fine-code", fineCodeRouter);
router.use("/motive", motiveRouter);
router.use("/appeal", appealRouter);
router.use("/ctdop", ctdopRouter);
router.use("/penalty-info", penaltyInfoRouter);
router.use("/penalty-doc", penaltyDocRouter);
router.use("/penalty", penaltyViewRouter);

export default router;