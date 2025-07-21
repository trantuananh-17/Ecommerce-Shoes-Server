import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";
import { WishlistController } from "./wishlist.controller";

const wishlistRouter = Router();
const wishlistController = new WishlistController();

wishlistRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  wishlistController.createWishlistController
);

wishlistRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  wishlistController.deleteWishlistItemController
);

wishlistRouter.get(
  "/sumary",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  wishlistController.getWishlistSumaryController
);

wishlistRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  wishlistController.getWishlistController
);

export default wishlistRouter;
