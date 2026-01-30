import { Router } from "express";
import FineCodeController from "../controllers/FineCodeController";
import { verifyToken } from "../middlewares/Authentication";

const fineCodeRouter = Router();
const controller = new FineCodeController();

fineCodeRouter.post("/", verifyToken, controller.createFineCode.bind(controller));
fineCodeRouter.put("/:id", verifyToken, controller.updateFineCode.bind(controller));
fineCodeRouter.delete("/:id", verifyToken, controller.deleteFineCode.bind(controller));
fineCodeRouter.get("/:id", controller.getFineCode.bind(controller));
fineCodeRouter.get("/", controller.findFineCode.bind(controller));

export default fineCodeRouter;
