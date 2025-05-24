import { TranslateFunction } from "../../types/express";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import CategoryModel, { ICategory } from "./category.model";
import { slugify } from "../../utils/helpers/slugify.helper";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import {
  ICategoryResponseDto,
  ICreateCategoryDto,
  ICreateCategoryResponseDto,
  IUpdateActiveCategoryDto,
  IUpdateCategoryDto,
} from "./category.dto";
import {
  categoryResponseMapper,
  createCategoryResponseMapper,
} from "./category.mapper";

export interface CategoryService {
  createCategoryService(
    DTOCategory: ICreateCategoryDto,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>>;

  getAllCategoryService(
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean
  ): Promise<
    APIResponse<{
      data: ICategoryResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;

  updateCategoryActiveService(
    id: string,
    DTOCategory: IUpdateActiveCategoryDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  updateCategoryService(
    id: string,
    DTOCategory: IUpdateCategoryDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;
}

export class CategoryServiceImpl implements CategoryService {
  async createCategoryService(
    DTOCategory: ICreateCategoryDto,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>> {
    return tryCatchService(
      async () => {
        const { name } = DTOCategory;

        const textVi = name.vi;
        const textEn = name.en;

        const slugVi = slugify(textVi);
        const slugEn = slugify(textEn);

        const existingCategory = await CategoryModel.findOne({
          $or: [{ "slug.vi": slugVi }, { "slug.en": slugEn }],
        });

        if (existingCategory) {
          return apiError(HttpStatus.CONFLICT, __("CATEGORY_ALREADY_EXISTS"));
        }

        const newCategory = new CategoryModel({
          name: {
            vi: textVi,
            en: textEn,
          },
          slug: {
            vi: slugVi,
            en: slugEn,
          },
        });

        const created = await newCategory.save();
        const response: ICreateCategoryResponseDto =
          createCategoryResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("CATEGORY_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createCategoryService",
      __
    );
  }

  async getAllCategoryService(
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean
  ): Promise<
    APIResponse<{
      data: ICategoryResponseDto[];
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

        const nameField = lang.startsWith("vi") ? "name.vi" : "name.en";
        const slugField = lang.startsWith("vi") ? "slug.vi" : "slug.en";

        const skip = (page - 1) * limit;

        const result = await CategoryModel.aggregate([
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
                    [nameField]: 1,
                    [slugField]: 1,
                  },
                },
              ],
              totalCount: [{ $count: "count" }],
            },
          },
        ]);

        const aggregationResult = result[0] as {
          data: ICategory[];
          totalCount: { count: number }[];
        };

        const totalDocs = aggregationResult.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        const response: ICategoryResponseDto[] = aggregationResult.data.map(
          (category) => categoryResponseMapper(category, lang)
        );

        return apiResponse(HttpStatus.OK, __("GET_CATEGORIES_SUCCESSFULLY"), {
          data: response,
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getAllCategoryService",
      __
    );
  }

  async updateCategoryActiveService(
    id: string,
    DTOCategory: IUpdateActiveCategoryDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { isActive } = DTOCategory;

        const updated = await CategoryModel.findByIdAndUpdate(
          id,
          { isActive: isActive },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("CATEGORY_NOT_FOUND"));
        }

        return apiResponse(
          HttpStatus.OK,
          __("CATEGORY_ISACTIVE_UPDATED_SUCCESSFULLY")
        );
      },
      "INTERNAL_SERVER_ERROR",
      "updateCategoryActiveService",
      __
    );
  }

  async updateCategoryService(
    id: string,
    DTOCategory: IUpdateCategoryDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { name, isActive } = DTOCategory;

        const textVi = name.vi;
        const textEn = name.en;

        const slugVi = slugify(textVi);
        const slugEn = slugify(textEn);

        const existingCategorySlug = await CategoryModel.findOne({
          $or: [{ "slug.vi": slugVi }, { "slug.en": slugEn }],
          _id: { $ne: id },
        });

        if (existingCategorySlug) {
          return apiError(
            HttpStatus.CONFLICT,
            __("CATEGORY_SLUG_ALREADY_EXISTS")
          );
        }

        const categoryUpdate = {
          name: {
            vi: textVi,
            en: textEn,
          },
          slug: {
            vi: slugVi,
            en: slugEn,
          },
          isActive: isActive,
        };

        const updated = await CategoryModel.findByIdAndUpdate(
          id,
          categoryUpdate,
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("CATEGORY_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("CATEGORY_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateCategoryService",
      __
    );
  }
}
