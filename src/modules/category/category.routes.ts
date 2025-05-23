import { Router } from "express";
import { CategoryController } from "./category.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post("/", categoryController.createCategoryController);
categoryRouter.get(
  "/",
  paginationMiddleware(),
  categoryController.getAllCategoryController
);
categoryRouter.patch("/:id", categoryController.updateCategoryActiveController);
categoryRouter.put("/:id", categoryController.updateCategoryController);
categoryRouter.delete("/:id", categoryController.deleteCategoryController);

export default categoryRouter;
