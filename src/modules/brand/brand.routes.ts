import { Router } from "express";
import { BrandController } from "./brand.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const brandRouter = Router();
const brandController = new BrandController();

brandRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  brandController.createBrandController
);
brandRouter.get("/list-name", brandController.getBrandNameController);
brandRouter.get(
  "/",
  paginationMiddleware(),
  brandController.getAllBrandsController
);

brandRouter.get("/:id", brandController.getBrandController);
brandRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  brandController.updateBrandController
);
brandRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  brandController.updateBrandActiveController
);

export default brandRouter;
