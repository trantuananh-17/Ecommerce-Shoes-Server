import { Router } from "express";
import { ProductController } from "./product.controller";
import upload from "../../middleware/upload.middleware";
import AuthRole from "../../middleware/auth.middleware";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const productRouter = Router();

const productController = new ProductController();

productRouter.post(
  "/",
  // AuthRole("admin", true),
  upload.array("images", 5),
  productController.createProductController
);

productRouter.put(
  "/:id",
  // AuthRole("admin", true),
  upload.array("images", 5),
  productController.updateProductController
);

productRouter.patch("/:id", productController.updateProductActiveController);

productRouter.get(
  "/",
  AuthRole("*", false, true),
  paginationMiddleware(),
  productController.getAllProductController
);

productRouter.get(
  "/admin",
  AuthRole("admin", false),
  paginationMiddleware(),
  productController.getAllProductAdminController
);

productRouter.get(
  "/slug/:slug",
  AuthRole("*", false, true),
  productController.getDetailProductBySlugController
);

productRouter.get(
  "/productId/:id",
  AuthRole("admin", false),
  productController.getDetailProductByIdController
);

export default productRouter;
