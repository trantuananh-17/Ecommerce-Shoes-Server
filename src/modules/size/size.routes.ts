import { Router } from "express";
import { SizeController } from "./size.controller";

const sizeRouter = Router();
const controller = new SizeController();

sizeRouter.get("/", controller.getAllSizeController);
sizeRouter.post("/", controller.createSizeController);
sizeRouter.delete("/:id", controller.deleteSizeController);

export default sizeRouter;
