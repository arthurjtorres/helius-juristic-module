import { Router } from "express";
import AgentController from "../controllers/AgentController";
import { verifyToken } from "../middlewares/Authentication";

const agentRouter = Router();
const controller = new AgentController();

agentRouter.post("/", verifyToken, controller.createAgent.bind(controller));
agentRouter.put("/:id", verifyToken, controller.updateAgent.bind(controller));
agentRouter.delete("/:id", verifyToken, controller.deleteAgent.bind(controller));
agentRouter.patch("/:id/reactivate", verifyToken, controller.reactivateAgent.bind(controller));
agentRouter.get("/:id", verifyToken, controller.getAgent.bind(controller));
agentRouter.get("/", verifyToken, controller.findAgent.bind(controller));

export default agentRouter;
