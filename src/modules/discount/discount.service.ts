import { Types } from "mongoose";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import {
  IDiscountActiveDto,
  IDiscountCreateResponseDto,
  IDiscountDto,
  IDiscountInfoResponseDto,
  IDiscountResponseDto,
} from "./discount.dto";
import DiscountModel, { IDiscount } from "./discount.model";
import {
  discountCreateResponseMapper,
  discountInfoResponseMapper,
  discountResponseMapper,
} from "./discount.mapper";

export interface DiscountService {
  createdDiscountService(
    DTODiscount: IDiscountDto,
    __: TranslateFunction
  ): Promise<APIResponse<IDiscountCreateResponseDto | null>>;

  updateDiscountService(
    id: string,
    DTODiscount: IDiscountDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  updateDiscountActiveService(
    id: string,
    DTODiscountActive: IDiscountActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  getAllDiscountService(
    lang: string | undefined,
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean | undefined
  ): Promise<
    APIResponse<{
      data: IDiscountResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;

  getDiscountById(
    id: string,
    __: TranslateFunction
  ): Promise<APIResponse<IDiscountInfoResponseDto | null>>;
}

export class DiscountServiceImpl implements DiscountService {
  createdDiscountService(
    DTODiscount: IDiscountDto,
    __: TranslateFunction
  ): Promise<APIResponse<IDiscountCreateResponseDto | null>> {
    return tryCatchService(
      async () => {
        const {
          discountCode,
          discountDescription,
          startTime,
          endTime,
          quantity,
          discountCost,
          discountPercentage,
          isActive,
          minItems,
          minItemsPerBrand,
        } = DTODiscount;

        const existingDiscount = await DiscountModel.findOne({
          discountCode,
        });

        if (existingDiscount) {
          return apiError(
            HttpStatus.CONFLICT,
            __("DISCOUNT_CODE_ALREADY_EXISTS")
          );
        }

        if (
          minItems &&
          minItemsPerBrand?.minQuantity &&
          minItems < minItemsPerBrand.minQuantity
        ) {
          return apiError(
            HttpStatus.BAD_REQUEST,
            __("MIN_ITEMS_MUST_BE_THAN_OR_EQUAL_MIN_ITEMS_PER_BRAND")
          );
        }

        const newDiscount = new DiscountModel({
          discountCode,
          discountCost,
          discountPercentage,
          quantity,
          startTime,
          endTime,
          discountDescription,
          isActive,
          minItems,
          minItemsPerBrand,
        });

        const created = await newDiscount.save();
        const response: IDiscountCreateResponseDto =
          discountCreateResponseMapper(created);

        return apiResponse(
          HttpStatus.CREATED,
          __("DISCOUNT_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createdDiscountService",
      __
    );
  }

  updateDiscountService(
    id: string,
    DTODiscount: IDiscountDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const {
          discountCode,
          discountDescription,
          startTime,
          endTime,
          quantity,
          discountCost,
          discountPercentage,
          isActive,
          minItems,
          minItemsPerBrand,
        } = DTODiscount;

        const existingDiscount = await DiscountModel.findOne({
          discountCode,
          _id: { $ne: id },
        });

        if (existingDiscount) {
          return apiError(
            HttpStatus.CONFLICT,
            __("DISCOUNT_CODE_ALREADY_EXISTS")
          );
        }

        const updated = await DiscountModel.findByIdAndUpdate(
          id,
          {
            discountCode,
            discountDescription,
            startTime,
            endTime,
            quantity,
            discountCost,
            discountPercentage,
            isActive,
            minItems,
            minItemsPerBrand,
          },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("DISCOUNT_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("DISCOUNT_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateDiscontService",
      __
    );
  }

  updateDiscountActiveService(
    id: string,
    DTODiscountActive: IDiscountActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { isActive } = DTODiscountActive;

        const existingDiscount = await DiscountModel.findOne({ id });

        if (existingDiscount) {
          return apiError(HttpStatus.NOT_FOUND, __("DISCOUNT_NOT_FOUND"));
        }

        const updated = await DiscountModel.findByIdAndUpdate(
          id,
          {
            isActive,
          },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("DISCOUNT_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("DISCOUNT_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateDiscountActiveService",
      __
    );
  }

  getAllDiscountService(
    lang: string | "vi",
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean | undefined
  ): Promise<
    APIResponse<{
      data: IDiscountResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  > {
    return tryCatchService(
      async () => {
        const filter: any = {};

        if (typeof isActive === "boolean") {
          filter.isActive = isActive;
        }

        const skip = (page - 1) * limit;

        const result = await DiscountModel.aggregate([
          { $match: filter },
          {
            $facet: {
              data: [
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    _id: 1,
                    discountCode: 1,
                    discountCost: 1,
                    discountPercentage: 1,
                    quantity: 1,
                    startTime: 1,
                    endTime: 1,
                    discountDescription: `$discountDescription.${lang}`,
                    isActive: 1,
                    minItems: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
              totalCount: [{ $count: "count" }],
            },
          },
        ]);

        const aggregationResult = result[0] as {
          data: IDiscount[];
          totalCount: { count: number }[];
        };

        const response: IDiscountResponseDto[] = aggregationResult.data.map(
          (discount: IDiscount) => discountResponseMapper(discount, lang)
        );

        const totalDocs = aggregationResult.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        return apiResponse(HttpStatus.OK, __("GET_ALL_DISCOUNT_SUCCESSFULLY"), {
          data: response,
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getAllDiscountService",
      __
    );
  }

  async getDiscountById(
    id: string,
    __: TranslateFunction
  ): Promise<APIResponse<IDiscountInfoResponseDto | null>> {
    return tryCatchService(
      async () => {
        const discountAggregate = await DiscountModel.aggregate([
          { $match: { _id: new Types.ObjectId(id) } },
          {
            $unwind: {
              path: "$minItemsPerBrand",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "brands",
              localField: "minItemsPerBrand.brand",
              foreignField: "_id",
              as: "brandInfo",
            },
          },
          {
            $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true },
          },
          {
            $group: {
              _id: "$_id",
              discountCode: { $first: "$discountCode" },
              discountCost: { $first: "$discountCost" },
              discountPercentage: { $first: "$discountPercentage" },
              quantity: { $first: "$quantity" },
              startTime: { $first: "$startTime" },
              endTime: { $first: "$endTime" },
              discountDescription: { $first: "$discountDescription" },
              isActive: { $first: "$isActive" },
              minItems: { $first: "$minItems" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              minItemsPerBrand: {
                $first: {
                  $cond: [
                    { $gt: ["$minItemsPerBrand.minQuantity", 0] },
                    {
                      brand: "$brandInfo.name",
                      minQuantity: "$minItemsPerBrand.minQuantity",
                    },
                    null,
                  ],
                },
              },
            },
          },
        ]);

        const aggregationResult = discountAggregate[0];

        const discountDto = discountInfoResponseMapper(aggregationResult, "vi");

        return apiResponse(HttpStatus.OK, __("GET_BRANDS_SUCCESSFULLY"), {
          data: discountDto,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getDiscountService",
      __
    );
  }
}
