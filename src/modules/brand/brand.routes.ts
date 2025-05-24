import { Router } from "express";
import { BrandController } from "./brand.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const brandRouter = Router();
const brandController = new BrandController();

brandRouter.post("/", brandController.createBrandController);
brandRouter.get("/list-name", brandController.getBrandNameController);
brandRouter.get(
  "/",
  paginationMiddleware(),
  brandController.getAllBrandsController
);

brandRouter.get("/:id", brandController.getBrandController);
brandRouter.put("/:id", brandController.updateBrandController);
brandRouter.patch("/:id", brandController.updateBrandActiveController);

export default brandRouter;
