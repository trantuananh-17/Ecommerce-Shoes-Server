import { translate } from "@vitalets/google-translate-api";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import {
  IClosureDTO,
  IClosureResponseDTO,
  IClosureWithLangDTO,
} from "./closure.dto";
import ClosureModel, { IClosure } from "./closure.model";
import { closureResponseMapper, closureWithLangMapper } from "./closure.mapper";

export interface ClosureService {
  createClosureService(
    DTOClosure: IClosureDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IClosureResponseDTO | null>>;

  updateClosureService(
    id: string,
    DTOClosure: IClosureDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IClosureResponseDTO | null>>;

  getAllClosureService(
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number
  ): Promise<
    APIResponse<{
      data: IClosureWithLangDTO[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;
}

export class ClosureServiceImpl implements ClosureService {
  async createClosureService(
    DTOClosure: IClosureDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IClosureResponseDTO | null>> {
    return tryCatchService(
      async () => {
        const { name, description } = DTOClosure;

        const existingClosure = await ClosureModel.findOne({
          $or: [{ "name.vi": name.vi }, { "name.en": name.en }],
        });

        if (existingClosure) {
          return apiError(HttpStatus.CONFLICT, __("CLOSURE_ALREADY_EXISTS"));
        }

        // Lấy trực tiếp dữ liệu
        const newClosure = new ClosureModel({
          name,
          description,
        });

        const created = await newClosure.save();
        const response: IClosureResponseDTO = closureResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("CLOSURE_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createClosureService",
      __
    );
  }

  async updateClosureService(
    id: string,
    DTOClosure: IClosureDTO,
    __: TranslateFunction
  ): Promise<APIResponse<IClosureResponseDTO | null>> {
    return tryCatchService(
      async () => {
        const { name, description } = DTOClosure;

        const existingClosure = await ClosureModel.findOne({
          $or: [{ "name.vi": name.vi }, { "name.en": name.en }],
        });

        if (existingClosure) {
          return apiError(HttpStatus.CONFLICT, __("CLOSURE_ALREADY_EXISTS"));
        }

        const updated = await ClosureModel.findByIdAndUpdate(
          id,
          { name, description },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("CLOSURE_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("CLOSURE_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateClosureService",
      __
    );
  }

  async getAllClosureService(
    lang: string,
    __: TranslateFunction,
    page: number,
    limit: number
  ): Promise<
    APIResponse<{
      data: IClosureWithLangDTO[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  > {
    return tryCatchService(
      async () => {
        const skip = (page - 1) * limit;
        const result = await ClosureModel.aggregate([
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
          data: IClosure[];
          totalCount: { count: number }[];
        };

        const response: IClosureWithLangDTO[] = aggregationResult.data.map(
          (closure: IClosure) => closureWithLangMapper(closure, lang)
        );

        const totalDocs = aggregationResult.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        return apiResponse(HttpStatus.OK, __("GET_ALL_CLOSURES_SUCCESSFULLY"), {
          data: response,
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getAllClosureService",
      __
    );
  }
}
