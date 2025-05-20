import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import {
  IBrandDto,
  IBrandResponseDto,
  IUpdateActiveBrandDto,
} from "./brand.dto";
import { brandResponseMapper } from "./brand.mapper";
import BrandModel, { IBrand } from "./brand.model";
import { FilterQuery } from "mongoose";

export interface BrandService {
  createBrandService(
    DTOBrand: IBrandDto,
    __: TranslateFunction
  ): Promise<APIResponse<IBrandResponseDto | null>>;

  getAllBrandsService(
    query: string | undefined,
    lang: string | undefined,
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean | undefined
  ): Promise<
    APIResponse<{
      data: IBrandResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;

  getBrandService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<IBrandResponseDto | null>>;

  updateBrandService(
    id: string,
    DTOBrand: IBrandDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  updateBrandActiveService(
    id: string,
    DTOBrand: IUpdateActiveBrandDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteBrandService(
    id: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;
}

export class BrandServiceImpl implements BrandService {
  async getAllBrandsService(
    query: string | undefined,
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean | undefined
  ): Promise<
    APIResponse<{
      data: IBrandResponseDto[];
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
          filter.$or = [{ name: searchRegex }, { country: searchRegex }];
        }

        if (typeof isActive === "boolean") {
          filter.isActive = isActive;
        }

        const skip = (page - 1) * limit;

        const result = await BrandModel.aggregate([
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
                    name: 1,
                    country: 1,
                    websiteUrl: 1,
                    isActive: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
              totalCount: [{ $count: "count" }],
            },
          },
        ]);

        const aggregationResult = result[0] as {
          data: IBrand[];
          totalCount: { count: number }[];
        };

        const totalDocs = aggregationResult.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        const response: IBrandResponseDto[] = aggregationResult.data.map(
          (brand: IBrand) => brandResponseMapper(brand)
        );

        return apiResponse(HttpStatus.OK, __("GET_BRANDS_SUCCESSFULLY"), {
          data: response,
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getBrandsService",
      __
    );
  }

  async createBrandService(
    DTOBrand: IBrandDto,
    __: TranslateFunction
  ): Promise<APIResponse<IBrandResponseDto | null>> {
    return tryCatchService(
      async () => {
        const { name, country, websiteUrl } = DTOBrand;

        const existingBrand = await BrandModel.findOne({ name: name });

        if (existingBrand) {
          return apiError(HttpStatus.CONFLICT, __("BRAND_ALREADY_EXISTS"));
        }

        const newBrand = new BrandModel({
          name,
          country,
          websiteUrl,
        });

        const created = await newBrand.save();

        const response: IBrandResponseDto = brandResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("BRAND_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createBrandService",
      __
    );
  }

  async updateBrandService(
    id: string,
    DTOBrand: any,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { name, country, websiteUrl } = DTOBrand;

        const brandUpdate = {
          name,
          country,
          websiteUrl,
        };

        const updated = await BrandModel.findByIdAndUpdate(id, brandUpdate, {
          new: true,
        });

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("BRAND_NOT_FOUND"));
        }

        return apiResponse(
          HttpStatus.CREATED,
          __("BRAND_UPDATED_SUCCESSFULLY")
        );
      },
      "INTERNAL_SERVER_ERROR",
      "updateBrandService",
      __
    );
  }

  async updateBrandActiveService(
    id: string,
    DTOBrand: IUpdateActiveBrandDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { isActive } = DTOBrand;

        const updated = await BrandModel.findByIdAndUpdate(
          id,
          { isActive: isActive },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("BRAND_NOT_FOUND"));
        }

        return apiResponse(
          HttpStatus.OK,
          __("BRAND_ISACTIVE_UPDATED_SUCCESSFULLY")
        );
      },
      "INTERNAL_SERVER_ERROR",
      "updateBrandActiveService",
      __
    );
  }

  async getBrandService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<IBrandResponseDto | null>> {
    return tryCatchService(
      async () => {
        const brand: IBrand | null = await BrandModel.findById(id);

        if (!brand) {
          return apiError(HttpStatus.NOT_FOUND, __("BRAND_NOT_FOUND"));
        }
        const response: IBrandResponseDto = brandResponseMapper(brand);

        return apiResponse(
          HttpStatus.CREATED,
          __("GET_BRAND_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getBrandServce",
      __
    );
  }

  async deleteBrandService(
    id: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>> {
    return tryCatchService(
      async () => {
        const deleted = await BrandModel.findByIdAndDelete(id);

        if (!deleted) {
          return apiError(HttpStatus.NOT_FOUND, __("BRAND_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("BRAND_DELETED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "deleteBrandService",
      __
    );
  }
}
