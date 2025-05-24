import { SizeService, SizeServiceImpl } from "./size.service";
import { Request, Response } from "express";
import { sizeIdsValidate, sizeValidate } from "./size.validator";
import HttpStatus from "../../utils/http-status.utils";
import { apiError } from "../../utils/helpers/api-response.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import { ICreateSizeDto } from "./size.dto";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";

export class SizeController {
  private readonly sizeService: SizeService;

  constructor() {
    this.sizeService = new SizeServiceImpl();
  }

  getAllSizesController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const result = await this.sizeService.getAllSizesService(
          req.__.bind(req),
          limit,
          page
        );

        return res.status(result.status_code).json(result);
      },
      res,
      req,
      "getAllSizesController"
    );
  };

  createSizeController = async (
    req: Request<ICreateSizeDto>,
    res: Response
  ): Promise<any> => {
    try {
      const { error, value } = sizeValidate.validate(req.body ?? {});

      if (error) {
        return handleValidationError(res, error, req.__.bind(req));
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
}
