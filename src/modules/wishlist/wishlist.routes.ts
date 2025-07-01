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

export default wishlistRouter;
