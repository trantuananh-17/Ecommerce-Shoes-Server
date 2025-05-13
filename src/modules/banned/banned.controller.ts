import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { bannedValidate } from "./banned.validate";
import { BannedService } from "./banned.service";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";
import dotenv from "dotenv";
dotenv.config();

export class BannerController {
  private readonly bannedService = new BannedService();

  createBannedController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = bannedValidate.validate(req.body ?? {});
        const lang = req.lang || "vi";

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.bannedService.createBannedWordService(
          value,
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createBannedWordController"
    );
  };

  deleteBannedWordController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const colorId = req.params.id;
        const lang = req.lang || "vi";

        console.log(lang);

        if (!isValidObjectId(colorId)) {
          return errorRes(
            res,
            req.__("INVALID_COLOR_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        const response = await this.bannedService.deleteBannedWordService(
          colorId,
          lang,
          req.__.bind(req)
        );

        if (!response) {
          return errorRes(res, req.__("COLOR_NOT_FOUND"), HttpStatus.NOT_FOUND);
        }

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "deleteBannedWordController"
    );
  };

  getAllBannedWordController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const response = await this.bannedService.getAllBannedWordService(
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllBannedWordController"
    );
  };
  getAllBannedWordWithPaginationController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;

        console.log(page, limit);

        const response =
          await this.bannedService.getAllBannedWordWithPaginationService(
            lang,
            page,
            limit,
            req.__.bind(req)
          );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllBannedWordController"
    );
  };
}
