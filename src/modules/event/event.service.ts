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
import { ICreateEventDto, ICreateEventResponseDto } from "./event.dto";
import { eventResponseMapper } from "./event.mapper";
import EventDiscountModel from "./event.model";

export interface EventService {
  createEventService(
    event: ICreateEventDto,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>>;
}

export class EventServiceImpl implements EventService {
  createEventService(
    event: ICreateEventDto,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>> {
    return tryCatchService(
      async () => {
        const { name, discountPercentage, startDate, endDate, products } =
          event;

        const existingProducts = await ProductModel.aggregate([
          {
            $match: {
              _id: { $in: products },
            },
          },
          {
            $lookup: {
              from: "events",
              localField: "_id",
              foreignField: "products",
              as: "existingEvents",
            },
          },
          {
            $match: {
              existingEvents: { $ne: [] },
            },
          },
        ]);

        if (existingProducts.length > 0) {
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
          products,
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
