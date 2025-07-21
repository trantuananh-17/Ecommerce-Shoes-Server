import { Router } from "express";
import { ProductController } from "./product.controller";
import upload from "../../middleware/upload.middleware";
import AuthRole from "../../middleware/auth.middleware";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const productRouter = Router();

const productController = new ProductController();

productRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.array("images", 5),
  productController.createProductController
);

productRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.array("images", 5),
  productController.updateProductController
);

productRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.updateProductActiveController
);

productRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  productController.getAllProductController
);

productRouter.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  productController.getAllProductAdminController
);

productRouter.get(
  "/slug/:slug",
  authMiddleware,
  productController.getDetailProductBySlugController
);

productRouter.get(
  "/productId/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  productController.getDetailProductByIdController
);

export default productRouter;
