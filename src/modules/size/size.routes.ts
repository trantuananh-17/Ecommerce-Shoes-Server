import { Router } from "express";
import { SizeController } from "./size.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import AuthRole from "../../middleware/auth.middleware";
import { Role } from "../user/models/user.model";

const sizeRouter = Router();
const controller = new SizeController();

sizeRouter.get(
  "/",
  AuthRole(Role.ADMIN),
  paginationMiddleware(),
  controller.getAllSizesController
);
sizeRouter.post("/", controller.createSizeController);
sizeRouter.get("/all/size-name", controller.getAllSizeNameController);

export default sizeRouter;
