import { Router } from "express";
import { ColorController } from "./color.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const colorRouter = Router();

const colorController = new ColorController();

colorRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  colorController.createColorController
);
colorRouter.get(
  "/",

  paginationMiddleware(),
  colorController.getAllColorsController
);
colorRouter.get(
  "/admin",
  paginationMiddleware(),
  colorController.getAllColorsByAdminController
);
colorRouter.get("/:id", colorController.getColorController);
colorRouter.get("/all/color-name", colorController.getAllColorNameController);
colorRouter.delete(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  colorController.deleteManyColorController
);
colorRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  colorController.deleteColorController
);
colorRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  colorController.updateColorController
);

export default colorRouter;
