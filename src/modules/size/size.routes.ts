import { Router } from "express";
import { SizeController } from "./size.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import roleMiddleware from "../../middleware/role.middleware";
import authMiddleware from "../../middleware/auth.middleware";

const sizeRouter = Router();
const controller = new SizeController();

sizeRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  controller.getAllSizesController
);
sizeRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.createSizeController
);
sizeRouter.get(
  "/all/size-name",
  authMiddleware,
  roleMiddleware(["admin"]),
  controller.getAllSizeNameController
);

export default sizeRouter;
