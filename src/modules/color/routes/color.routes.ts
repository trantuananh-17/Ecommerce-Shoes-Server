import { Router } from "express";
import { ColorController } from "../controllers/color.controller";

const colorRouter = Router();

const colorController = new ColorController();

colorRouter.post("/", colorController.createColorController);
colorRouter.get("/", colorController.getAllColorsController);
colorRouter.get("/:id", colorController.getColorController);
colorRouter.delete("/", colorController.deleteManyColorController);
colorRouter.delete("/:id", colorController.deleteColorController);
colorRouter.patch("/:id", colorController.updateColorController);

export default colorRouter;
