import { Request, Response } from "express";
import { ClosureService, ClosureServiceImpl } from "./closure.service";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { closureValidate } from "./closure.validate";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";

export class ClosureController {
  private readonly closureService: ClosureService;

  constructor() {
    this.closureService = new ClosureServiceImpl();
  }

  createClosureController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = closureValidate.validate(req.body ?? {});
        const lang = req.lang || "vi";

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.closureService.createClosureService(
          value,
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createClosureController"
    );
  };

  getAllClosureController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const result = await this.closureService.getAllClosureService(
          lang,
          req.__.bind(req),
          page,
          limit
        );
        return res.status(result.status_code).json(result);
      },
      res,
      req,
      "getAllClosureController"
    );
  };

  updateClosureController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const brandId = req.params.id;
        const { error, value } = closureValidate.validate(req.body ?? {});

        if (!isValidObjectId(brandId)) {
          return errorRes(
            res,
            req.__("INVALID_BRAND_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.closureService.updateClosureService(
          brandId,
          value,
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateClosureController"
    );
  };
}
