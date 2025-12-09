import { Router } from "express";
import AgentController from "../controllers/AgentController";

const agentRouter = Router();
const controller = new AgentController();

agentRouter.post("/", controller.createAgent.bind(controller));
agentRouter.put("/:id", controller.updateAgent.bind(controller));
agentRouter.delete("/:id", controller.deleteAgent.bind(controller));
agentRouter.get("/:id", controller.getAgent.bind(controller));
agentRouter.get("/", controller.findAgent.bind(controller));

export default agentRouter;
