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
import { translateViEn } from "../../utils/helpers/translate.helper";

export interface ClosureService {
  createClosureService(
    DTOClosure: IClosureDTO,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<IClosureResponseDTO | null>>;

  updateClosureService(
    id: string,
    DTOClosure: IClosureDTO,
    lang: string,
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
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<IClosureResponseDTO | null>> {
    return tryCatchService(
      async () => {
        const { name, description } = DTOClosure;

        const field = lang.startsWith("vi") ? "name.vi" : "name.en";

        const existingClosure = await ClosureModel.findOne({ [field]: name });

        if (existingClosure) {
          return apiError(HttpStatus.CONFLICT, __("CLORUSE_ALREADY_EXISTS"));
        }

        const { textVi: nameVi, textEn: nameEn } = await translateViEn(
          name,
          lang
        );
        const { textVi: descriptionVi, textEn: descriptionEn } =
          await translateViEn(description, lang);

        const newClosure = new ClosureModel({
          name: {
            vi: nameVi,
            en: nameEn,
          },
          description: {
            vi: descriptionVi,
            en: descriptionEn,
          },
        });

        const created = await newClosure.save();
        const response: IClosureResponseDTO = closureResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("Closure_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createClosureService",
      lang,
      __
    );
  }

  async updateClosureService(
    id: string,
    DTOClosure: IClosureDTO,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<IClosureResponseDTO | null>> {
    return tryCatchService(
      async () => {
        const { name, description } = DTOClosure;

        const field = lang.startsWith("vi") ? "name.vi" : "name.en";

        const { textVi: nameVi, textEn: nameEn } = await translateViEn(
          name,
          lang
        );
        const { textVi: descriptionVi, textEn: descriptionEn } =
          await translateViEn(description, lang);

        const existingClosure = await ClosureModel.findOne({ [field]: name });

        if (existingClosure) {
          return apiError(HttpStatus.CONFLICT, __("CLORUSE_ALREADY_EXISTS"));
        }

        const closureUpdate = {
          name: {
            vi: nameVi,
            en: nameEn,
          },
          description: {
            vi: descriptionVi,
            en: descriptionEn,
          },
        };

        const updated = await ClosureModel.findByIdAndUpdate(
          id,
          closureUpdate,
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("CLORUSE_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("CLORUSE_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateClosureService",
      lang,
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
        let query = ClosureModel.find();
        const skip = (page - 1) * limit;
        const nameField = lang.startsWith("vi") ? "name.vi" : "name.en";
        const descriptionField = lang.startsWith("vi") ? "name.vi" : "name.en";

        // const listClosure: IClosure[] = await query.select({
        //   [nameField]: 1,
        //   [descriptionField]: 1,
        //   _id: 1,
        //   isActive: 1,
        // });

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
      lang,
      __
    );
  }
}
