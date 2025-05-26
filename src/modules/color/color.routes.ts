import { Router } from "express";
import { ColorController } from "./color.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const colorRouter = Router();

const colorController = new ColorController();

colorRouter.post("/", colorController.createColorController);
colorRouter.get(
  "/",
  paginationMiddleware(),
  colorController.getAllColorsController
);
colorRouter.get("/:id", colorController.getColorController);
colorRouter.get("/all/color-name", colorController.getAllColorNameController);
colorRouter.delete("/", colorController.deleteManyColorController);
colorRouter.delete("/:id", colorController.deleteColorController);
colorRouter.patch("/:id", colorController.updateColorController);

export default colorRouter;
