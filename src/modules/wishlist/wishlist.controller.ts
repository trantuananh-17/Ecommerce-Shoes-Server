import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { WishlistService, WishlistServiceImpl } from "./wishlist.service";

export class WishlistController {
  private readonly wishlistService: WishlistService;

  constructor() {
    this.wishlistService = new WishlistServiceImpl();
  }

  createWishlistController = (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;
        const response = await this.wishlistService.createWishlistService(
          userId,
          req.body,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createWishlistController"
    );
  };
}
