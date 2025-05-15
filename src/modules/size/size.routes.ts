import { Router } from "express";
import { SizeController } from "./size.controller";

const sizeRouter = Router();
const controller = new SizeController();

sizeRouter.get("/", controller.getAllSizesController);
sizeRouter.post("/", controller.createSizeController);
sizeRouter.delete("/:id", controller.deleteSizeController);
sizeRouter.delete("/", controller.deleteManySizeController);

export default sizeRouter;
