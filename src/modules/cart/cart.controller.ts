import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { CartService, CartServiceImpl } from "./cart.service";

export class CartController {
  private readonly cartService: CartService;

  constructor() {
    this.cartService = new CartServiceImpl();
  }

  createCartItemController = (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;
        const response = await this.cartService.createCartItemService(
          userId,
          req.body,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createCartItemController"
    );
  };

  updateCartItemController = (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;

        const response = await this.cartService.updateCartItemService(
          userId,
          req.body,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateCartItemController"
    );
  };

  deleteCartItemController = (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;
        const itemId = req.params.id;

        console.log(itemId);

        const response = await this.cartService.deleteCartItemService(
          userId,
          itemId,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "deleteCartItemController"
    );
  };

  getCartItemSumaryController = (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;

        const response = await this.cartService.getCartItemSumaryService(
          userId,
          req.__.bind(req)
        );

        return res.status(response.status_code).json(response);
      },
      res,
      req,
      "getCartItemSumaryController"
    );
  };

  getCartItemsController = (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const userId = req.userId;
        const lang = req.lang || "vi";
        const response = await this.cartService.getCartItemsService(
          userId,
          lang,
          req.__.bind(req)
        );

        return res.status(response.status_code).json(response);
      },
      res,
      req,
      "getCartItemsController"
    );
  };
}
