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
import {
  discountFieldsForCart,
  eventDiscountLookupStageForCart,
} from "../product/product.pipeline";

export interface WishlistService {
  createWishlistService(
    userId: string,
    wishlistDto: ICreateWishlistDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteWishlistService(
    userId: string,
    productId: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  getWishlistsService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  getWishlistSumaryService(
    userId: string,
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
    productId: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        let existingWishlist = await WishlistModel.findOne({ user: userId });

        if (!existingWishlist) {
          return apiError(HttpStatus.NOT_FOUND, __("WISHLIST_NOT_FOUND"));
        }

        const existingIndex = existingWishlist.products.findIndex(
          (item) => item.toString() === productId
        );

        if (existingIndex === -1) {
          return apiError(HttpStatus.NOT_FOUND, __("WISHLIST_ITEM_NOT_FOUND"));
        }

        existingWishlist.products.splice(existingIndex, 1);
        await existingWishlist.save();

        return apiResponse(
          HttpStatus.OK,
          __("WISHLIST_ITEM_DELETED_SUCCESSFULLY")
        );
      },
      "INTERNAL_SERVER_ERROR",
      "deleteWishlistService",
      __
    );
  }

  getWishlistsService(
    userId: string,
    lang: string | "vi",
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        try {
          const now = new Date();

          // Tìm kiếm wishlist của người dùng
          const existingWishlist = await WishlistModel.findOne({
            user: userId,
          });

          // Nếu không có wishlist hoặc không có sản phẩm, trả về mảng rỗng
          if (!existingWishlist || existingWishlist.products.length === 0) {
            return apiResponse(HttpStatus.OK, __("SUCCESS"), []);
          }

          // Chuyển đổi ID sản phẩm thành ObjectId để sử dụng trong MongoDB
          const productIds = existingWishlist.products.map(
            (item) => new Types.ObjectId(item.toString())
          );

          console.log(productIds);

          const pipeline = [
            {
              // Tìm wishlist của người dùng, đảm bảo có ít nhất một sản phẩm
              $match: {
                user: new Types.ObjectId(userId), // userId từ tham số
              },
            },
            {
              $lookup: {
                from: "products", // Join với bảng "products"
                localField: "products", // Mảng ObjectId từ wishlist
                foreignField: "_id", // So sánh với _id trong bảng products
                as: "productDetails", // Lưu kết quả vào "productDetails"
              },
            },
            {
              $unwind: "$productDetails", // Chuyển đổi mảng thành object
            },
            {
              $project: {
                productId: "$productDetails._id", // Lấy ID sản phẩm
                productName: "$productDetails.name", // Lấy tên sản phẩm
                productSlug: "$productDetails.slug", // Lấy slug sản phẩm
                productThumbnail: "$productDetails.thumbnail", // Lấy thumbnail
                productPrice: "$productDetails.price", // Lấy giá sản phẩm
              },
            },
          ];

          // Thực hiện aggregation
          const aggregatedItems = await WishlistModel.aggregate(pipeline);

          // Debugging: In ra kết quả để kiểm tra
          console.log(aggregatedItems);

          // Ánh xạ lại các sản phẩm trong wishlist
          const result = aggregatedItems.map((item) => {
            const cartProduct = existingWishlist.products.find(
              (p) => p.toString() === item.productId.toString() // So sánh đúng giữa ObjectId
            );

            return cartProduct;
          });

          return apiResponse(HttpStatus.OK, __("SUCCESS"), result);
        } catch (error) {
          // Log lỗi để dễ dàng theo dõi
          console.error("Error in getWishlistsService:", error);
          return apiResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            __("INTERNAL_SERVER_ERROR"),
            null
          );
        }
      },
      "INTERNAL_SERVER_ERROR", // Mã lỗi chung
      "getWishlistsService",
      __
    );
  }

  getWishlistSumaryService(
    userId: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const existingWishlist = await WishlistModel.findOne({ user: userId });

        if (!existingWishlist) {
          return apiResponse(HttpStatus.OK, __("ITEMS_SUMARY"), {
            totalItems: 0,
          });
        }

        const totalItems = existingWishlist.products.length;

        return apiResponse(HttpStatus.OK, __("ITEMS_SUMARY"), { totalItems });
      },
      "INTERNAL_SERVER_ERROR",
      "getWishlistSumaryService",
      __
    );
  }
}
