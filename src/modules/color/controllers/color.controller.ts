import { Request, Response } from "express";
import { ColorService } from "../services/color.service";
import {
  colodIdsValidate,
  colorUpdateValidate,
  colorValidate,
} from "../validators/color.validate";
import { handleValidationError } from "../../../utils/helpers/validation.helper";
import HttpStatus from "../../../utils/http-status.utils";
import { apiError } from "../../../utils/helpers/api-response.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../../utils/helpers/error-response.helper";
import { tryCatchController } from "../../../utils/helpers/trycatch.helper";

export class ColorController {
  private readonly colorService = new ColorService();

  createColorController = async (req: Request, res: Response): Promise<any> => {
    try {
      const { error, value } = colorValidate.validate(req.body ?? {});
      const lang = req.lang || "vi";

      if (error) {
        return handleValidationError(res, error, req.__.bind(req));
      }

      const response = await this.colorService.createColorService(
        value,
        lang,
        req.__.bind(req)
      );

      res.status(response.status_code).json(response);
    } catch (error: any) {
      console.error("Error in ColorController.createColorController:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          apiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            req.__("INTERNAL_SERVER_ERROR"),
            error
          )
        );
    }
  };

  getAllColorsController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const response = await this.colorService.getAllColorsService(
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllColorController"
    );
  };

  getAllColorsWithPaginationController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;

        const response =
          await this.colorService.getAllColorsWithPaginationService(
            limit,
            page,
            lang,
            req.__.bind(req)
          );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllColorsWithPaginationController"
    );
  };

  getColorController = async (req: Request, res: Response): Promise<any> => {
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

        const response = await this.colorService.getColorService(
          colorId,
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getColorController"
    );
  };

  deleteColorController = async (req: Request, res: Response): Promise<any> => {
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

        const response = await this.colorService.deleteColorService(
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
      "deleteColorController"
    );
  };

  deleteManyColorController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "Vi";
        const { error, value } = colodIdsValidate.validate(req.body ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        for (let colodId of value.ids) {
          if (!isValidObjectId(colodId)) {
            return errorRes(
              res,
              req.__("INVALID_SIZE_ID"),
              HttpStatus.BAD_REQUEST
            );
          }
        }

        // Gọi service để xóa nhiều kích thước
        const response = await this.colorService.deleteManyColorService(
          value,
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "deleteManyColorController"
    );
  };

  updateColorController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const colorId = req.params.id;
        const lang = req.lang || "vi";

        const { error, value } = colorUpdateValidate.validate(req.body ?? {});

        console.log(lang);

        if (!isValidObjectId(colorId)) {
          return errorRes(
            res,
            req.__("INVALID_COLOR_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          return handleValidationError(res, error, req.__.bind(req));
        }

        const response = await this.colorService.updateColorService(
          colorId,
          value,
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
      "updateColorController"
    );
  };
}
