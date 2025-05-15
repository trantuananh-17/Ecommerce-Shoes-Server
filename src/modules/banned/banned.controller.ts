import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { bannedValidate, bannedWordIdsValidate } from "./banned.validate";
import { BannedService, BannedServiceImpl } from "./banned.service";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";
import dotenv from "dotenv";
dotenv.config();

export class BannerController {
  private readonly bannedService: BannedService;

  constructor() {
    this.bannedService = new BannedServiceImpl();
  }

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

  deleteManyBannedWordController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "Vi";
        const { error, value } = bannedWordIdsValidate.validate(req.body ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        for (let colodId of value.ids) {
          if (!isValidObjectId(colodId)) {
            return errorRes(
              res,
              req.__("INVALID_BANNED_ID"),
              HttpStatus.BAD_REQUEST
            );
          }
        }

        const response = await this.bannedService.deleteManyBannedWordService(
          value,
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "deleteBannedWordController"
    );
  };

  getAllBannedWordsController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const page = req.query.page
          ? parseInt(req.query.page as string)
          : undefined;
        const limit = req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined;

        const response = await this.bannedService.getAllBannedWordService(
          lang,
          req.__.bind(req),
          page,
          limit
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllBannedWordsController"
    );
  };
}
