import { Router } from "express";
import FineCodeController from "../controllers/FineCodeController";

const fineCodeRouter = Router();
const controller = new FineCodeController();

fineCodeRouter.post("/", controller.createFineCode.bind(controller));
fineCodeRouter.put("/:id", controller.updateFineCode.bind(controller));
fineCodeRouter.delete("/:id", controller.deleteFineCode.bind(controller));
fineCodeRouter.get("/:id", controller.getFineCode.bind(controller));
fineCodeRouter.get("/", controller.findFineCode.bind(controller));

export default fineCodeRouter;
