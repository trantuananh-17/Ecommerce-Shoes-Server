import { Router } from "express";
import { CategoryController } from "./category.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post("/", categoryController.createCategoryController);
categoryRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  categoryController.getAllCategoryController
);
categoryRouter.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  categoryController.getAllCategoryByAdminController
);
categoryRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.updateCategoryActiveController
);
categoryRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.updateCategoryController
);

export default categoryRouter;
