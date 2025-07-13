import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import SizeQuantityModel from "../product/models/sizeQuantity.model";
import {
  discountFieldsForCart,
  eventDiscountLookupStageForCart,
} from "../product/product.pipeline";
import {
  ICartItemsDto,
  ICartItemSumaryDto,
  ICreateCartItemDto,
  IUpdateCartItemDto,
} from "./cart.dto";
import { cartResponseMapper } from "./cart.mapper";
import CartModel from "./cart.model";

export interface CartService {
  createCartItemService(
    userId: string,
    CartDTO: ICreateCartItemDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  updateCartItemService(
    userId: string,
    CartDTO: IUpdateCartItemDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteCartItemService(
    userId: string,
    productId: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  getCartItemSumaryService(
    userId: string,
    __: TranslateFunction
  ): Promise<APIResponse<ICartItemSumaryDto | null>>;

  getCartItemsService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<ICartItemsDto[] | null>>;
}

export class CartServiceImpl implements CartService {
  getCartItemSumaryService(
    userId: string,
    __: TranslateFunction
  ): Promise<APIResponse<ICartItemSumaryDto | null>> {
    return tryCatchService(
      async () => {
        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
          return apiResponse(HttpStatus.OK, __("ITEMS_SUMARY"), {
            totalItems: 0,
          });
        }

        const totalItems = cart.products.length;

        return apiResponse(HttpStatus.OK, __("ITEMS_SUMARY"), { totalItems });
      },
      "INTERNAL_SERVER_ERROR",
      "getCartItemService",
      __
    );
  }

  getCartItemsService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<ICartItemsDto[]>> {
    return tryCatchService(
      async () => {
        const now = new Date();

        const nameField = lang.startsWith("vi") ? "name.vi" : "name.en";
        const slugField = lang.startsWith("vi") ? "slug.vi" : "slug.en";

        const cart = await CartModel.findOne({ user: userId });

        if (!cart || cart.products.length === 0) {
          return apiResponse(HttpStatus.OK, __("SUCCESS"), []);
        }

        const sizeQuantityIds = cart.products.map((item) => item.sizeQuantity);

        const pipeline: any[] = [
          {
            $match: {
              _id: { $in: sizeQuantityIds },
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
            },
          },
          { $unwind: "$product" },
          eventDiscountLookupStageForCart(now),
          {
            $addFields: {
              ...discountFieldsForCart(lang),
            },
          },
          {
            $lookup: {
              from: "sizes",
              localField: "size",
              foreignField: "_id",
              as: "sizeInfo",
            },
          },
          { $unwind: "$sizeInfo" },
          {
            $project: {
              _id: 1,
              productId: "$product._id",
              productName: {
                $ifNull: [
                  { $getField: { field: lang, input: "$product.name" } },
                  "$product.name.en",
                ],
              },
              slug: {
                $ifNull: [
                  { $getField: { field: lang, input: "$product.slug" } },
                  "$product.slug.en",
                ],
              },
              thumbnail: "$product.thumbnail",
              price: "$product.price",
              discountedPrice: 1,
              sizeId: "$sizeInfo._id",
              size: "$sizeInfo.name",
              stockQuantity: "$quantity",
            },
          },
        ];

        const aggregatedItems = await SizeQuantityModel.aggregate(pipeline);

        const result = aggregatedItems.map((item) => {
          const cartProduct = cart.products.find(
            (p) => p.sizeQuantity.toString() === item._id.toString()
          );

          return cartResponseMapper(item, cartProduct?.quantity || 0);
        });

        const totalCartPrice = result.reduce((acc, item) => {
          return acc + item.discountedPrice * item.quantity;
        }, 0);

        return apiResponse(HttpStatus.OK, __("SUCCESS"), {
          result,
          totalPrices: totalCartPrice,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getCartItemsService",
      __
    );
  }

  deleteCartItemService(
    userId: string,
    productId: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
          return apiError(HttpStatus.NOT_FOUND, __("CART_NOT_FOUND"));
        }

        const existingIndex = cart.products.findIndex(
          (item) => item.sizeQuantity.toString() === productId
        );

        if (existingIndex === -1) {
          return apiError(HttpStatus.NOT_FOUND, __("CART_ITEM_NOT_FOUND"));
        }

        cart.products.splice(existingIndex, 1);
        await cart.save();

        return apiResponse(HttpStatus.OK, __("CART_ITEM_DELETED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "deleteCartItemService",
      __
    );
  }

  updateCartItemService(
    userId: string,
    CartDTO: IUpdateCartItemDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { sizeQuantityId, quantity } = CartDTO;

        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
          return apiError(HttpStatus.NOT_FOUND, __("CART_NOT_FOUND"));
        }
        const itemIndex = cart.products.findIndex(
          (item) => item.sizeQuantity.toString() === sizeQuantityId
        );

        if (itemIndex === -1) {
          return apiError(HttpStatus.NOT_FOUND, __("CART_ITEM_NOT_FOUND"));
        }

        const sizeQuantity = await SizeQuantityModel.findById(sizeQuantityId);

        if (!sizeQuantity) {
          return apiError(
            HttpStatus.NOT_FOUND,
            __("PRODUCT_OR_SIZE_NOT_FOUND")
          );
        }

        if (quantity > sizeQuantity.quantity) {
          return apiError(HttpStatus.BAD_REQUEST, __("QUANTITY_EXCEEDS_STOCK"));
        }

        cart.products[itemIndex].quantity = quantity;

        await cart.save();

        return apiResponse(HttpStatus.OK, __("CART_ITEM_UPDATE_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "createCartItemService",
      __
    );
  }

  createCartItemService(
    userId: string,
    CartDTO: ICreateCartItemDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { productId, sizeId, quantity } = CartDTO;
        let cart = await CartModel.findOne({ user: userId });

        if (!cart) {
          cart = await CartModel.create({ user: userId, products: [] });
        }

        const sizeQuantity = await SizeQuantityModel.findOne({
          productId,
          size: sizeId,
        });

        if (!sizeQuantity) {
          return apiError(
            HttpStatus.NOT_FOUND,
            __("PRODUCT_OR_SIZE_NOT_FOUND")
          );
        }

        if (quantity > sizeQuantity.quantity) {
          return apiError(HttpStatus.BAD_REQUEST, __("QUANTITY_EXCEEDS_STOCK"));
        }

        const existingItem = cart.products.findIndex(
          (item) => item.sizeQuantity.toString() === sizeQuantity._id.toString()
        );

        if (existingItem !== -1) {
          const newQuantity = cart.products[existingItem].quantity + quantity;
          if (newQuantity > sizeQuantity.quantity) {
            return apiError(
              HttpStatus.BAD_REQUEST,
              __("QUANTITY_EXCEEDS_STOCK")
            );
          }

          cart.products[existingItem].quantity = newQuantity;
        } else {
          if (quantity > sizeQuantity.quantity) {
            return apiError(
              HttpStatus.BAD_REQUEST,
              __("QUANTITY_EXCEEDS_STOCK")
            );
          }

          cart.products.push({
            sizeQuantity: sizeQuantity._id,
            quantity: quantity,
          });
        }

        await cart.save();

        return apiResponse(
          HttpStatus.CREATED,
          __("CART_ITEM_CREATED_SUCCESSFULLY")
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createCartItemService",
      __
    );
  }
}
