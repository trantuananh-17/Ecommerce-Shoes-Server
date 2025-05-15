import { Router } from "express";
import { CategoryController } from "./category.controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

export default categoryRouter;
