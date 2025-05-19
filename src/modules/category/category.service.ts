import { TranslateFunction } from "../../types/express";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import CategoryModel, { ICategory } from "./category.model";
import { slugify } from "../../utils/helpers/slugify.helper";
import { translateViEn } from "../../utils/helpers/translate.helper";
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
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>>;

  getAllCategoryService(
    lang: string,
    __: TranslateFunction,
    active?: boolean
  ): Promise<APIResponse<ICategoryResponseDto | null>>;

  updateCategoryActiveService(
    id: string,
    DTOCategory: IUpdateActiveCategoryDto,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  updateCategoryService(
    id: string,
    DTOCategory: IUpdateCategoryDto,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteCategoryService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;
}

export class CategoryServiceImpl implements CategoryService {
  async createCategoryService(
    DTOCategory: ICreateCategoryDto,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<ICreateCategoryResponseDto | null>> {
    return tryCatchService(
      async () => {
        const { name } = DTOCategory;
        const field = lang.startsWith("vi") ? "name.vi" : "name.en";

        const { textVi, textEn } = await translateViEn(name, lang);

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
      lang,
      __
    );
  }

  async getAllCategoryService(
    lang: string,
    __: TranslateFunction,
    isActive?: boolean
  ): Promise<APIResponse<ICategoryResponseDto | null>> {
    return tryCatchService(
      async () => {
        let query = CategoryModel.find();
        const nameField = lang.startsWith("vi") ? "name.vi" : "name.en";
        const slugField = lang.startsWith("vi") ? "slug.vi" : "slug.en";

        if (isActive === true || isActive === false) {
          query = query.where("isActive").equals(isActive);
        }

        const listCategory: ICategory[] = await query.select({
          [nameField]: 1,
          [slugField]: 1,
          _id: 1,
          isActive: 1,
        });
        const response: ICategoryResponseDto[] = listCategory.map((category) =>
          categoryResponseMapper(category, lang)
        );

        return apiResponse(
          HttpStatus.OK,
          __("GET_CATEGORIES_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getAllCategoryService",
      lang,
      __
    );
  }

  async updateCategoryActiveService(
    id: string,
    DTOCategory: IUpdateActiveCategoryDto,
    lang: string,
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
      lang,
      __
    );
  }

  async updateCategoryService(
    id: string,
    DTOCategory: IUpdateCategoryDto,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { name, isActive } = DTOCategory;

        const field = lang.startsWith("vi") ? "name.vi" : "name.en";

        const { textVi, textEn } = await translateViEn(name, lang);

        const slugVi = slugify(textVi);
        const slugEn = slugify(textEn);

        const existingCategorySlug = await CategoryModel.findOne({
          $or: [{ "slug.vi": slugVi }, { "slug.en": slugEn }],
          _id: { $ne: id }, //  loại trừ chính nó
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
      lang,
      __
    );
  }

  async deleteCategoryService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>> {
    return tryCatchService(
      async () => {
        const deleted = await CategoryModel.findByIdAndDelete(id);

        if (!deleted) {
          return apiError(HttpStatus.NOT_FOUND, __("CATEGORY_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("CATEGORY_DELETED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "deleteCategoryService",
      lang,
      __
    );
  }
}
