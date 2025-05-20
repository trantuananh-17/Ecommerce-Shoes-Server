import {
  IColorDeleteManyDto,
  IColorResponseDto,
  IColorUpdateDTO,
  IColorWithLangResponseDto,
  ICreateColorDto,
} from "./color.dto";
import ColorModel, { IColor } from "./color.model";
import { colorResponseMapper, colorWithLangMapper } from "./color.mapper";
import HttpStatus from "../../utils/http-status.utils";
import {
  apiError,
  APIResponse,
  apiResponse,
} from "../../utils/helpers/api-response.helper";
import { TranslateFunction } from "../../types/express";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";

export interface ColorService {
  createColorService(
    DTOColor: ICreateColorDto,
    __: TranslateFunction
  ): Promise<APIResponse<IColorResponseDto | null>>;

  getAllColorsService(
    lang: string,
    __: TranslateFunction,
    limit?: number,
    page?: number
  ): Promise<APIResponse<IColorWithLangResponseDto[]>>;

  getColorService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<IColorWithLangResponseDto | null>>;

  deleteColorService(
    id: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteManyColorService(
    value: IColorDeleteManyDto,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

  updateColorService(
    id: string,
    DTOColor: IColorUpdateDTO,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;
}

export class ColorServiceImpl implements ColorService {
  async createColorService(DTOColor: ICreateColorDto, __: TranslateFunction) {
    return tryCatchService(
      async () => {
        const { name } = DTOColor;

        const existingColor = await ColorModel.findOne({
          $or: [{ "name.vi": name.vi }, { "name.en": name.en }],
        });

        if (existingColor) {
          return apiError(HttpStatus.CONFLICT, __("COLOR_ALREADY_EXISTS"));
        }

        const newColor = new ColorModel({
          name: {
            vi: name.vi,
            en: name.en,
          },
        });

        const created = await newColor.save();
        const response: IColorResponseDto = colorResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("COLOR_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createColorService",
      __
    );
  }

  async getAllColorsService(
    lang: string,
    __: TranslateFunction,
    limit?: number,
    page?: number
  ) {
    return tryCatchService(
      async () => {
        let query = ColorModel.find();

        // Nếu có truyền phân trang
        if (limit !== undefined && page !== undefined) {
          const skip = (page - 1) * limit;
          query = query.skip(skip).limit(limit);
        }

        const listColor: IColor[] = await query;

        const response: IColorWithLangResponseDto[] = listColor.map((color) =>
          colorWithLangMapper(color, lang)
        );

        return apiResponse(
          HttpStatus.OK,
          __("GET_ALL_COLOR_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getAllColorsService",
      __
    );
  }

  async getColorService(id: string, lang: string, __: TranslateFunction) {
    return tryCatchService(
      async () => {
        const color: IColor | null = await ColorModel.findById(id);

        if (!color) {
          return apiError(HttpStatus.NOT_FOUND, __("COLOR_NOT_FOUND"));
        }
        const response: IColorWithLangResponseDto = colorWithLangMapper(
          color,
          lang
        );

        return apiResponse(
          HttpStatus.CREATED,
          __("GET_COLOR_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getColorServce",
      __
    );
  }

  async deleteColorService(id: string, __: TranslateFunction) {
    return tryCatchService(
      async () => {
        const deleted = await ColorModel.findByIdAndDelete(id);

        if (!deleted) {
          return apiError(HttpStatus.NOT_FOUND, __("COLOR_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("COLOR_DELETED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "deleteColorServce",
      __
    );
  }

  async deleteManyColorService(
    value: IColorDeleteManyDto,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const response = await ColorModel.deleteMany({
          _id: { $in: value.ids },
        });
        return apiResponse(
          HttpStatus.OK,
          __("DELETE_MANY_COLOR_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "deleteColorServce",
      __
    );
  }

  async updateColorService(
    id: string,
    DTOColor: IColorUpdateDTO,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const { isActive } = DTOColor;

        const updated = await ColorModel.findByIdAndUpdate(
          id,
          { isActive: isActive },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("COLOR_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("COLOR_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateColorServce",
      __
    );
  }
}
