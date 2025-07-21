import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";
import { CartController } from "./cart.controller";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.get(
  "/sumary",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  cartController.getCartItemSumaryController
);
cartRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  cartController.getCartItemsController
);
cartRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  cartController.createCartItemController
);
cartRouter.put(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  cartController.updateCartItemController
);
cartRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  cartController.deleteCartItemController
);

export default cartRouter;
