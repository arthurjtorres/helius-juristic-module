import { Router } from "express";
import AgentController from "../controllers/AgentController";
import { verifyToken } from "../middlewares/Authentication";

const agentRouter = Router();
const controller = new AgentController();

agentRouter.post("/", verifyToken, controller.createAgent.bind(controller));
agentRouter.put("/:id", verifyToken, controller.updateAgent.bind(controller));
agentRouter.delete("/:id", verifyToken, controller.deleteAgent.bind(controller));
agentRouter.get("/:id", controller.getAgent.bind(controller));
agentRouter.get("/", controller.findAgent.bind(controller));

export default agentRouter;
