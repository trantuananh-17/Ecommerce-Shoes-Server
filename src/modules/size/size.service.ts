import { TranslateFunction } from "../../types/express";
import {
  apiError,
  APIResponse,
  apiResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import { ICreateSizeDto, ISizeResponseDto } from "./size.dto";
import { sizeResponseMapper } from "./size.mapper";
import SizeModel, { ISize } from "./size.model";

export interface SizeService {
  createSizeService(
    DTOSize: ICreateSizeDto,
    __: TranslateFunction
  ): Promise<APIResponse<ISizeResponseDto | null>>;

  getAllSizesService(
    __: TranslateFunction,
    limit: number,
    page: number
  ): Promise<
    APIResponse<{
      data: ISizeResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;
}

export class SizeServiceImpl implements SizeService {
  async createSizeService(DTOSize: ICreateSizeDto, __: TranslateFunction) {
    try {
      const { name } = DTOSize;
      const existingSize = await SizeModel.findOne({ name });

      if (existingSize) {
        return apiError(HttpStatus.CONFLICT, __("SIZE_ALREADY_EXISTS"));
      }

      const newSize = new SizeModel({ name });
      const created = await newSize.save();

      const response: ISizeResponseDto = sizeResponseMapper(created);
      return apiResponse(
        HttpStatus.CREATED,
        __("SIZE_CREATED_SUCCESSFULLY"),
        response
      );
    } catch (error: any) {
      return apiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        __("INTERNAL_SERVER_ERROR"),
        error
      );
    }
  }

  async getAllSizesService(
    __: TranslateFunction,
    limit = 6,
    page = 1
  ): Promise<
    APIResponse<{
      data: ISizeResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  > {
    return tryCatchService(
      async () => {
        const skip = (page - 1) * limit;

        const result = await SizeModel.aggregate([
          {
            $addFields: {
              nameAsNumber: { $toInt: "$name" },
            },
          },
          {
            $facet: {
              data: [
                { $sort: { nameAsNumber: 1 } },
                { $skip: skip },
                { $limit: limit },
              ],
              totalCount: [{ $count: "count" }],
            },
          },
        ]);

        const sizes = result[0]?.data || [];
        const totalDocs = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        return apiResponse(HttpStatus.OK, __("GET_ALL_SIZE_SUCCESSFULLY"), {
          data: sizes.map(sizeResponseMapper),
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getAllSizesService",
      __
    );
  }
}
