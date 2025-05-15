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
  ICatogoryResponseDto,
  ICreateCategoryDto,
  ICreateCategoryResponseDto,
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
  ): Promise<APIResponse<ICatogoryResponseDto | null>>;

  updateCategoryActiveService(
    id: string,
    DTOCategory: any,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

  deleteCategoryService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

  deleteManyCategoryService(
    slug: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;
}

export class CategoryServiceImpl implements CategoryService {
  async createCategoryService(
    DTOCategory: ICreateCategoryDto,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const { name } = DTOCategory;
        const field = lang.startsWith("vi") ? "name.vi" : "name.en";

        const existingCategory = await CategoryModel.findOne({ [field]: name });

        if (existingCategory) {
          return apiError(
            HttpStatus.CONFLICT,
            __("WORD_BANNED_ALREADY_EXISTS")
          );
        }

        const { textVi, textEn } = await translateViEn(name, lang);

        const slugVi = slugify(textVi);
        const slugEn = slugify(textEn);

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
  ) {
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
        });
        const response: ICatogoryResponseDto[] = listCategory.map((category) =>
          categoryResponseMapper(category, lang)
        );

        return apiResponse(
          HttpStatus.OK,
          __("GET_CATEGORIES_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "updateCategoryActiveService",
      lang,
      __
    );
  }

  async updateCategoryActiveService(
    id: string,
    DTOCategory: any,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {},
      "INTERNAL_SERVER_ERROR",
      "updateCategoryActiveService",
      lang,
      __
    );
  }

  async deleteCategoryService(id: string, lang: string, __: TranslateFunction) {
    return tryCatchService(
      async () => {},
      "INTERNAL_SERVER_ERROR",
      "updateCategoryActiveService",
      lang,
      __
    );
  }

  async deleteManyCategoryService(
    id: string,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {},
      "INTERNAL_SERVER_ERROR",
      "updateCategoryActiveService",
      lang,
      __
    );
  }
}
