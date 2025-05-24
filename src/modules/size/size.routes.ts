import { Router } from "express";
import { SizeController } from "./size.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const sizeRouter = Router();
const controller = new SizeController();

sizeRouter.get("/", paginationMiddleware(), controller.getAllSizesController);
sizeRouter.post("/", controller.createSizeController);

export default sizeRouter;
