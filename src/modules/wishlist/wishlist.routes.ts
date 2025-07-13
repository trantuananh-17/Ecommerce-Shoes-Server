import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import AuthRole from "../../middleware/auth.middleware";

const wishlistRouter = Router();
const wishlistController = new WishlistController();

wishlistRouter.post(
  "/",
  AuthRole("*", true),
  wishlistController.createWishlistController
);

wishlistRouter.delete(
  "/:id",
  AuthRole("*", true),
  wishlistController.deleteWishlistItemController
);

wishlistRouter.get(
  "/sumary",
  AuthRole("*", true),
  wishlistController.getWishlistSumaryController
);

wishlistRouter.get(
  "/",
  AuthRole("*", true),
  wishlistController.getWishlistController
);

export default wishlistRouter;
