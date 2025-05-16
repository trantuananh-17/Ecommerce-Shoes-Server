import {
  IColorDeleteManyDto,
  IColorResponseDto,
  IColorUpdateDTO,
  IColorWithLangResponseDto,
  ICreateColorDto,
} from "../dtos/color.dto";
import { translate } from "@vitalets/google-translate-api";
import ColorModel, { IColor } from "../models/color.model";
import {
  colorResponseMapper,
  colorWithLangMapper,
} from "../mappers/color.mapper";
import HttpStatus from "../../../utils/http-status.utils";
import {
  apiError,
  APIResponse,
  apiResponse,
} from "../../../utils/helpers/api-response.helper";
import { TranslateFunction } from "../../../types/express";
import { tryCatchService } from "../../../utils/helpers/trycatch.helper";

export interface ColorService {
  createColorService(
    DTOColor: ICreateColorDto,
    lang: string,
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
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteManyColorService(
    value: IColorDeleteManyDto,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

  updateColorService(
    id: string,
    DTOColor: IColorUpdateDTO,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;
}

export class ColorServiceImpl implements ColorService {
  async createColorService(
    DTOColor: ICreateColorDto,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const { name } = DTOColor;

        const field = lang.startsWith("vi") ? "name.vi" : "name.en";

        const existingColor = await ColorModel.findOne({ [field]: name });

        if (existingColor) {
          return apiError(HttpStatus.CONFLICT, __("COLOR_ALREADY_EXISTS"));
        }

        let nameVi = "";
        let nameEn = "";

        if (lang.startsWith("vi")) {
          nameVi = name;
          const { text } = await translate(name, { from: "vi", to: "en" });
          nameEn = text;
        } else {
          nameEn = name;
          const { text } = await translate(name, { from: "en", to: "vi" });
          nameVi = text;
        }

        const newColor = new ColorModel({
          name: {
            vi: nameVi,
            en: nameEn,
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
      lang,
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
      lang,
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
      lang,
      __
    );
  }

  async deleteColorService(id: string, lang: string, __: TranslateFunction) {
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
      lang,
      __
    );
  }

  async deleteManyColorService(
    value: IColorDeleteManyDto,
    lang: string,
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
      lang,
      __
    );
  }

  async updateColorService(
    id: string,
    DTOColor: IColorUpdateDTO,
    lang: string,
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
      lang,
      __
    );
  }
}
