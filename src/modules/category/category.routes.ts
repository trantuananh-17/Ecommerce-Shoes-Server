import { Router } from "express";
import { CategoryController } from "./category.controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post("/", categoryController.createCategoryController);
categoryRouter.get("/", categoryController.getAllCategoryController);

export default categoryRouter;
