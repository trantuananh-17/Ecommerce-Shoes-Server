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
    query: string | undefined,
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean
  ): Promise<
    APIResponse<{
      data: IColorWithLangResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;

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
    query: string | undefined,
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean
  ): Promise<
    APIResponse<{
      data: IColorWithLangResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  > {
    return tryCatchService(
      async () => {
        const filter: any = {};

        if (query?.trim()) {
          const searchRegex = new RegExp(query.trim(), "i");
          const nameField = lang.startsWith("vi") ? "name.vi" : "name.en";
          filter[nameField] = searchRegex;
        }

        if (typeof isActive === "boolean") {
          filter.isActive = isActive;
        }

        const skip = (page - 1) * limit;

        const result = await ColorModel.aggregate([
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
                    isActive: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    name: 1,
                    hex: 1,
                  },
                },
              ],
              totalCount: [{ $count: "count" }],
            },
          },
        ]);

        const aggregationResult = result[0] as {
          data: IColor[];
          totalCount: { count: number }[];
        };

        const totalDocs = aggregationResult.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        const response = aggregationResult.data.map((color) =>
          colorWithLangMapper(color, lang)
        );

        return apiResponse(HttpStatus.OK, __("GET_ALL_COLOR_SUCCESSFULLY"), {
          data: response,
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
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
