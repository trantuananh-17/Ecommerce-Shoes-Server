import { Types } from "mongoose";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import { ICreateWishlistDto } from "./wishlist.dto";
import WishlistModel from "./wishlist.model";

export interface WishlistService {
  createWishlistService(
    userId: string,
    wishlistDto: ICreateWishlistDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteWishlistService(
    userId: string,
    wishlistDto: null,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  getWishlistsService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  getWishlistSumaryService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<null>>;
}

export class WishlistServiceImpl implements WishlistService {
  createWishlistService(
    userId: string,
    wishlistDto: ICreateWishlistDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { productId } = wishlistDto;

        let existingWishlist = await WishlistModel.findOne({ user: userId });

        if (!existingWishlist) {
          existingWishlist = await WishlistModel.create({
            user: userId,
            products: [],
          });
        }

        existingWishlist.products.push(new Types.ObjectId(productId));

        existingWishlist.save();
        return apiResponse(
          HttpStatus.CREATED,
          __("WISHLIST_CREATED_SUCCESSFULLY")
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createWishlistService",
      __
    );
  }

  deleteWishlistService(
    userId: string,
    wishlistDto: null,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    throw new Error("Method not implemented.");
  }

  getWishlistsService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    throw new Error("Method not implemented.");
  }

  getWishlistSumaryService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    throw new Error("Method not implemented.");
  }
}
