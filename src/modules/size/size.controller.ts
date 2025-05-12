import { Request, Response } from "express";
import { SizeService } from "./size.service";
import { sizeValidate } from "./size.validator";
import HttpStatus from "../../utils/http-status.utils";
import { apiError } from "../../utils/api-response.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/error-response.helper";

export class SizeController {
  private readonly sizeService = new SizeService();

  getAllSizeController = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.sizeService.getAllSizeService(
        req.__.bind(req)
      );

      res.status(response.status_code).json(response);
    } catch (error: any) {
      console.error("Error in SizeController.tgetAllSizeController:", error);
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

  createSizeController = async (req: Request, res: Response): Promise<any> => {
    try {
      const { error, value } = sizeValidate.validate(req.body ?? {});

      if (error) {
        const messageKey = error.details[0].message;
        return res.status(HttpStatus.BAD_REQUEST).json({
          status_code: HttpStatus.BAD_REQUEST,
          message: req.__(messageKey),
        });
      }

      const response = await this.sizeService.createSizeService(
        value,
        req.__.bind(req)
      );

      res.status(response.status_code).json(response);
    } catch (error: any) {
      console.error("Error in SizeController.createSizeController:", error);
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

  deleteSizeController = async (req: Request, res: Response): Promise<any> => {
    try {
      const sizeId = req.params.id;

      if (!isValidObjectId(sizeId)) {
        return errorRes(res, req.__("INVALID_SIZE_ID"), HttpStatus.BAD_REQUEST);
      }

      const response = await this.sizeService.deleteSizeService(
        sizeId,
        req.__.bind(req)
      );

      if (!response) {
        return errorRes(res, req.__("SIZE_NOT_FOUND"), HttpStatus.NOT_FOUND);
      }

      res.status(response.status_code).json(response);
    } catch (error: any) {
      console.error("Error in SizeController.deleteSizeController:", error);
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
}
