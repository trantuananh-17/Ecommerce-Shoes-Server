import { log } from "winston";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import { ICreateCategoryResponseDto } from "../category/category.dto";
import ProductModel from "../product/models/product.model";
import { ICreateEventResponseDto, IEventDto } from "./event.dto";
import { eventResponseMapper } from "./event.mapper";
import EventDiscountModel from "./event.model";
import { Schema, Types } from "mongoose";

export interface EventService {
  createEventService(
    event: IEventDto,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>>;

  updateEventService(
    eventId: string,
    event: IEventDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;
}

export class EventServiceImpl implements EventService {
  updateEventService(
    eventId: string,
    event: IEventDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const {
          name,
          discountPercentage,
          startDate,
          endDate,
          products,
          isActive,
        } = event;

        // Lấy thông tin event hiện tại từ database
        const eventInfo = await EventDiscountModel.findById(eventId);
        const oldProducts = eventInfo?.products || [];

        // Chuyển đổi các productId mới thành ObjectId
        const newProductIds = products.map(
          (productId) => new Types.ObjectId(productId)
        );

        // Chuyển đổi các productId cũ trong oldProducts thành ObjectId để so sánh
        const oldProductIds = oldProducts.map(
          (productId: any) => new Types.ObjectId(productId)
        );

        // Tìm các productId mới (sản phẩm thay đổi hoặc thêm mới)
        const newProducts = newProductIds.filter(
          (productId) =>
            !oldProductIds.some((oldProductId) =>
              oldProductId.equals(productId)
            )
        );

        if (newProducts.length > 0) {
          // Kiểm tra các sản phẩm mới có tồn tại trong event khác không
          const existingEvents = await EventDiscountModel.aggregate([
            {
              $match: {
                products: { $in: newProducts },
              },
            },
            {
              $project: {
                products: 1,
              },
            },
          ]);

          if (existingEvents.length > 0) {
            return apiError(
              HttpStatus.CONFLICT,
              __("PRODUCT_ALREADY_EXISTS_IN_EVENT")
            );
          }
        }

        // Tạo đối tượng cập nhật nếu không có sự cố
        const eventUpdate = {
          name,
          discountPercentage,
          startDate,
          endDate,
          products: newProductIds,
          isActive,
        };

        // Cập nhật event trong database
        const updatedEvent = await EventDiscountModel.findByIdAndUpdate(
          eventId,
          eventUpdate,
          {
            new: true,
          }
        );

        if (!updatedEvent) {
          return apiError(HttpStatus.NOT_FOUND, __("EVENT_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("EVENT_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateEventService",
      __
    );
  }

  createEventService(
    event: IEventDto,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>> {
    return tryCatchService(
      async () => {
        const { name, discountPercentage, startDate, endDate, products } =
          event;

        const productIds = products.map((productId) => {
          return new Types.ObjectId(productId);
        });

        const existingEvents = await EventDiscountModel.aggregate([
          {
            $match: {
              products: { $in: productIds },
            },
          },
          {
            $project: {
              products: 1,
            },
          },
        ]);

        if (existingEvents.length > 0) {
          return apiError(
            HttpStatus.CONFLICT,
            __("PRODUCT_ALREADY_EXISTS_IN_EVENT")
          );
        }

        const newEvent = new EventDiscountModel({
          name,
          discountPercentage,
          startDate,
          endDate,
          products: productIds,
        });

        const created = await newEvent.save();

        const response: ICreateEventResponseDto = eventResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("EVENT_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createEventService",
      __
    );
  }
}
