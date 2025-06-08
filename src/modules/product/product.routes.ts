import { Router } from "express";
import { ProductController } from "./product.controller";
import upload from "../../middleware/upload.middleware";
import AuthRole from "../../middleware/auth.middleware";

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

export default productRouter;
