import { TranslateFunction } from "../../types";
import { apiError, apiResponse } from "../../utils/api-response.helper";
import HttpStatus from "../../utils/http-status.utils";
import { SizeResponseDto } from "./size.dto";
import { sizeResponseMapper } from "./size.mapper";
import SizeModel, { ISize } from "./size.model";

export class SizeService {
  async createSizeService(value: ISize, __: TranslateFunction) {
    try {
      const { name } = value;
      const existingSize = await SizeModel.findOne({ name });

      if (existingSize) {
        return apiError(HttpStatus.NOT_FOUND, __("SIZE_ALREADY_EXISTS"));
      }

      const created = await SizeModel.create({ name });
      const response: SizeResponseDto = sizeResponseMapper(created);
      return apiResponse(HttpStatus.CREATED, __("SIZE_CREATED"), response);
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

  async getAllSizeService(__: TranslateFunction) {
    try {
      const listSize: any[] = await SizeModel.find().sort({ name: 1 });
      const response: SizeResponseDto[] = listSize.map(sizeResponseMapper);

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
}
