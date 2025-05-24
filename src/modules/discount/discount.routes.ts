import { Router } from "express";
import { DiscountController } from "./discount.controller";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const discountRouter = Router();
const discountController = new DiscountController();

discountRouter.post("/", discountController.createDiscountController);
discountRouter.get(
  "/",
  paginationMiddleware(),
  discountController.getAllDiscountController
);
discountRouter.get("/:id", discountController.getDiscountController);
discountRouter.put("/:id", discountController.updateDiscountController);
discountRouter.patch("/:id", discountController.updateDiscountActiveController);

export default discountRouter;
