import { Router } from "express";
import { SizeController } from "./size.controller";

const sizeRouter = Router();
const controller = new SizeController();

sizeRouter.post("/", controller.create);

export default sizeRouter;
