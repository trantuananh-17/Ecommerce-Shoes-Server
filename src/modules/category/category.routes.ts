import { Router } from "express";
import { CategoryController } from "./category.controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post("/", categoryController.createCategoryController);
categoryRouter.get("/", categoryController.getAllCategoryController);
categoryRouter.patch("/:id", categoryController.updateCategoryActiveController);
categoryRouter.put("/:id", categoryController.updateCategoryController);
categoryRouter.delete("/:id", categoryController.deleteCategoryController);

export default categoryRouter;
