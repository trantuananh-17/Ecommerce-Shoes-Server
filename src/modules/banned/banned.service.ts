import { translate } from "@vitalets/google-translate-api";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  APIResponse,
  apiResponse,
} from "../../utils/helpers/api-response.helper";
import HttpStatus from "../../utils/http-status.utils";
import { bannedWithLangMapper, bannedResponseMapper } from "./banned.mapper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import {
  IBannedDto,
  IBannedResponseDto,
  IBannedWithLangResponseDto,
  IBannedWordDeleteManyDto,
} from "./banned.dto";
import BannedModel, { IBanned } from "./banned.model";

export interface BannedService {
  createBannedWordService(
    DTOBanned: IBannedDto,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<IBannedResponseDto | null>>;

  deleteBannedWordService(
    id: string,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteManyBannedWordService(
    value: IBannedWordDeleteManyDto,
    lang: string,
    __: TranslateFunction
  ): Promise<APIResponse<any>>;

  getAllBannedWordService(
    lang: string,
    __: TranslateFunction,
    limit?: number,
    page?: number
  ): Promise<APIResponse<IBannedWithLangResponseDto[]>>;
}

export class BannedServiceImpl implements BannedService {
  async createBannedWordService(
    DTOBanned: IBannedDto,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const { word } = DTOBanned;

        const field = lang.startsWith("vi") ? "word.vi" : "word.en";

        const existingBanned = await BannedModel.findOne({ [field]: word });

        if (existingBanned) {
          return apiError(
            HttpStatus.CONFLICT,
            __("WORD_BANNED_ALREADY_EXISTS")
          );
        }

        let wordVi = "";
        let wordEn = "";

        if (lang.startsWith("vi")) {
          wordVi = word;
          const { text } = await translate(word, { from: "vi", to: "en" });
          wordEn = text;
        } else {
          wordEn = word;
          const { text } = await translate(word, { from: "en", to: "vi" });
          wordVi = text;
        }

        const newBanner = new BannedModel({
          word: {
            vi: wordVi,
            en: wordEn,
          },
        });

        const created = await newBanner.save();
        const response: IBannedResponseDto = bannedResponseMapper(created);
        return apiResponse(
          HttpStatus.CREATED,
          __("WORD_BANNED_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createBannedService",
      lang,
      __
    );
  }

  async deleteBannedWordService(
    id: string,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const deleted = await BannedModel.findByIdAndDelete(id);

        if (!deleted) {
          return apiError(HttpStatus.NOT_FOUND, __("WORD_BANNED_NOT_FOUND"));
        }

        return apiResponse(
          HttpStatus.OK,
          __("WORD_BANNED_DELETED_SUCCESSFULLY")
        );
      },
      "INTERNAL_SERVER_ERROR",
      "deleteBannedServce",
      lang,
      __
    );
  }

  async deleteManyBannedWordService(
    value: IBannedWordDeleteManyDto,
    lang: string,
    __: TranslateFunction
  ) {
    return tryCatchService(
      async () => {
        const response = await BannedModel.deleteMany({
          _id: { $in: value.ids },
        });
        return apiResponse(
          HttpStatus.OK,
          __("DELETE_MANY_BANNED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "deleteBannedServce",
      lang,
      __
    );
  }

  async getAllBannedWordService(
    lang: string,
    __: TranslateFunction,
    page?: number,
    limit?: number
  ) {
    return tryCatchService(
      async () => {
        let query = BannedModel.find();

        if (page !== undefined && limit !== undefined) {
          const skip = (page - 1) * limit;
          query = query.skip(skip).limit(limit);
        }

        const listBanned: IBanned[] = await query.exec();

        const response: IBannedWithLangResponseDto[] = listBanned.map((word) =>
          bannedWithLangMapper(word, lang)
        );

        return apiResponse(
          HttpStatus.OK,
          __("GET_ALL_BANNED_WORD_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getAllBannedWordService",
      lang,
      __
    );
  }
}
