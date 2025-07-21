import { Router } from "express";
import { DiscountController } from "./discount.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

const discountRouter = Router();
const discountController = new DiscountController();

discountRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  discountController.createDiscountController
);
discountRouter.get(
  "/",
  paginationMiddleware(),
  discountController.getAllDiscountController
);
discountRouter.get("/:id", discountController.getDiscountController);
discountRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  discountController.updateDiscountController
);
discountRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  discountController.updateDiscountActiveController
);

export default discountRouter;
