import { TranslateFunction } from "../../types/express";
import { APIResponse } from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";

export interface CategoryService {
  createCategoryService(
    DTOCategory: any,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

  getAllCategoryActiveService(
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

  getAllCategoryService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

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
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;
}

export class CategoryServiceImpl implements CategoryService {
  async createCategoryService(
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

  async getAllCategoryActiveService(lang: string, __: TranslateFunction) {
    return tryCatchService(
      async () => {},
      "INTERNAL_SERVER_ERROR",
      "updateCategoryActiveService",
      lang,
      __
    );
  }

  async getAllCategoryService(id: string, lang: string, __: TranslateFunction) {
    return tryCatchService(
      async () => {},
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
