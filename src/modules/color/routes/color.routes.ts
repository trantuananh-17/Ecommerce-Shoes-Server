import { Router } from "express";
import { ColorController } from "../controllers/color.controller";

const colorRouter = Router();

const colorController = new ColorController();

colorRouter.post("/", colorController.createColorController);
colorRouter.get("/:id", colorController.getColorController);
colorRouter.get("/", colorController.getAllColorsController);
colorRouter.delete("/:id", colorController.deleteColorController);
colorRouter.patch("/:id", colorController.updateColorController);

export default colorRouter;
