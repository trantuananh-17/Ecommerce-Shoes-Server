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
  upload.array("images", 8),
  productController.createProductController
);

productRouter.put(
  "/:id",
  // AuthRole("admin", true),
  upload.array("images", 6),
  productController.updateProductController
);

productRouter.get(
  "/",
  AuthRole("*", false, true),
  paginationMiddleware(),
  productController.getAllProductController
);

productRouter.get(
  "/slug/:slug",
  AuthRole("*", false, true),
  productController.getDetailProductBySlugController
);

export default productRouter;
