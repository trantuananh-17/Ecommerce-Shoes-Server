import { Router } from "express";
import { CartController } from "./cart.controller";
import AuthRole from "../../middleware/auth.middleware";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.get(
  "/sumary",
  AuthRole("*", true),
  cartController.getCartItemSumaryController
);
cartRouter.get("/", AuthRole("*", true), cartController.getCartItemsController);
cartRouter.post(
  "/",
  AuthRole("*", true),
  cartController.createCartItemController
);
cartRouter.put(
  "/",
  AuthRole("*", true),
  cartController.updateCartItemController
);
cartRouter.delete(
  "/:id",
  AuthRole("*", true),
  cartController.deleteCartItemController
);

export default cartRouter;
