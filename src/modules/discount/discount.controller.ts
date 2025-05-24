import { Request, Response } from "express";
import { DiscountService, DiscountServiceImpl } from "./discount.service";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { discountActiveSchema, discountSchema } from "./discount.validate";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";

export class DiscountController {
  private readonly discountService: DiscountService;

  constructor() {
    this.discountService = new DiscountServiceImpl();
  }

  createDiscountController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const { error, value } = discountSchema.validate(req.body ?? {});

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.discountService.createdDiscountService(
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createDiscountController"
    );
  };

  getAllDiscountController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const isActive =
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined;

        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const result = await this.discountService.getAllDiscountService(
          lang,
          req.__.bind(req),
          page,
          limit,
          isActive
        );

        return res.status(result.status_code).json(result);
      },
      res,
      req,
      "getAllDiscountController"
    );
  };

  getDiscountController = (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const discountId = req.params.id;

        if (!isValidObjectId(discountId)) {
          return errorRes(
            res,
            req.__("INVALID_COLOR_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        const response = await this.discountService.getDiscountById(
          discountId,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getDiscountController"
    );
  };

  updateDiscountController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const discountId = req.params.id;

        const { error, value } = discountSchema.validate(req.body ?? {});

        if (!isValidObjectId(discountId)) {
          return errorRes(
            res,
            req.__("INVALID_DISCOUNT_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.discountService.updateDiscountService(
          discountId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateDiscountActiveController"
    );
  };

  updateDiscountActiveController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const discountId = req.params.id;

        const { error, value } = discountActiveSchema.validate(req.body ?? {});

        if (!isValidObjectId(discountId)) {
          return errorRes(
            res,
            req.__("INVALID_DISCOUNT_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.discountService.updateDiscountActiveService(
          discountId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateDiscountController"
    );
  };
}
