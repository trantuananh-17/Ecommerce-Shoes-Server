import { TranslateFunction } from "../../types/express";
import { apiError, apiResponse } from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import { ICreateSizeDto, ISizeResponseDto } from "./size.dto";
import { sizeResponseMapper } from "./size.mapper";
import SizeModel, { ISize } from "./size.model";

export class SizeService {
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

  async deleteSizeService(id: string, __: TranslateFunction) {
    try {
      const deleted = await SizeModel.findByIdAndDelete(id);

      if (!deleted) {
        return apiError(HttpStatus.NOT_FOUND, __("SIZE_NOT_FOUND"));
      }

      return apiResponse(HttpStatus.OK, __("SIZE_DELETED_SUCCESSFULLY"));
    } catch (error: any) {
      return apiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        __("INTERNAL_SERVER_ERROR"),
        error
      );
    }
  }

  async getAllSizesService(__: TranslateFunction) {
    try {
      const listSize: ISize[] = await SizeModel.find().sort({ name: 1 });
      const response: ISizeResponseDto[] = listSize.map(sizeResponseMapper);

      return apiResponse(
        HttpStatus.OK,
        __("GET_ALL_SIZE_SUCCESSFULLY"),
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

  async getAllSizesWithPaginationService(
    limit: number,
    page: number,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const skip = (page - 1) * limit;

        const listSize: ISize[] = await SizeModel.find()
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit);
        const response: ISizeResponseDto[] = listSize.map(sizeResponseMapper);

        return apiResponse(
          HttpStatus.OK,
          __("GET_ALL_SIZE_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getAllBannedWithPaginationService",
      lang,
      __
    );
  }
}
