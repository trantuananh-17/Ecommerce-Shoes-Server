import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import {
  IMaterialDTO,
  IMaterialResponseDTO,
  IMaterialWithLangDTO,
} from "./material.dto";
import {
  materialResponseMapper,
  materialWithLangMapper,
} from "./material.mapper";
import MaterialModel, { IMaterial } from "./material.model";

export interface MaterialService {
  createMaterialService(
    DTOMaterial: IMaterialDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IMaterialResponseDTO | null>>;

  updateMaterialService(
    id: string,
    DTOMaterial: IMaterialDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IMaterialResponseDTO | null>>;

  getAllMaterialService(
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number
  ): Promise<
    APIResponse<{
      data: IMaterialWithLangDTO[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;
}

export class MaterialServiceImpl implements MaterialService {
  async createMaterialService(
    DTOMaterial: IMaterialDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IMaterialResponseDTO | null>> {
    return tryCatchService(
      async () => {
        const { name, description } = DTOMaterial;

        const existingClosure = await MaterialModel.findOne({
          $or: [{ "name.vi": name.vi }, { "name.en": name.en }],
        });

        if (existingClosure) {
          return apiError(HttpStatus.CONFLICT, __("MATERIAL_ALREADY_EXISTS"));
        }

        const newClosure = new MaterialModel({
          name,
          description,
        });

        const created = await newClosure.save();
        const response: IMaterialResponseDTO = materialResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("CLOSURE_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createMaterialService",
      __
    );
  }

  async updateMaterialService(
    id: string,
    DTOMaterial: IMaterialDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IMaterialResponseDTO | null>> {
    return tryCatchService(
      async () => {
        const { name, description } = DTOMaterial;

        const existingClosure = await MaterialModel.findOne({
          $or: [{ "name.vi": name.vi }, { "name.en": name.en }],
          _id: { $ne: id },
        });

        if (existingClosure) {
          return apiError(HttpStatus.CONFLICT, __("MATERIAL_ALREADY_EXISTS"));
        }

        const updated = await MaterialModel.findByIdAndUpdate(
          id,
          { name, description },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("MATERIAL_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("MATERIAL_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateClosureService",
      __
    );
  }

  async getAllMaterialService(
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number
  ): Promise<
    APIResponse<{
      data: IMaterialWithLangDTO[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  > {
    return tryCatchService(
      async () => {
        const skip = (page - 1) * limit;
        const result = await MaterialModel.aggregate([
          {
            $facet: {
              data: [
                { $sort: { name: 1 } },
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
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
          data: IMaterial[];
          totalCount: { count: number }[];
        };

        const response: IMaterialWithLangDTO[] = aggregationResult.data.map(
          (material: IMaterial) => materialWithLangMapper(material, lang)
        );

        const totalDocs = aggregationResult.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        return apiResponse(HttpStatus.OK, __("GET_ALL_MATERIAL_SUCCESSFULLY"), {
          data: response,
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getAllMaterialService",
      __
    );
  }
}
