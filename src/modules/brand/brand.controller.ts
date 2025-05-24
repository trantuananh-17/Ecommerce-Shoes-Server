import { Request, Response } from "express";
import { BrandService, BrandServiceImpl } from "./brand.service";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { brandValidate, updateBrandActiveValidate } from "./brand.validate";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";

export class BrandController {
  private readonly brandService: BrandService;

  constructor() {
    this.brandService = new BrandServiceImpl();
  }

  createBrandController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = brandValidate.validate(req.body ?? {});
        const lang = req.lang || "vi";

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.brandService.createBrandService(
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createBrandController"
    );
  };

  updateBrandActiveController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const brandId = req.params.id;
        const { error, value } = updateBrandActiveValidate.validate(
          req.body ?? {}
        );

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

        const response = await this.brandService.updateBrandActiveService(
          brandId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateBrandActiveController"
    );
  };

  updateBrandController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const brandId = req.params.id;
        const { error, value } = brandValidate.validate(req.body ?? {});

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

        const response = await this.brandService.updateBrandService(
          brandId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateBrandController"
    );
  };

  getAllBrandsController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const query =
          typeof req.query.q === "string" ? req.query.q.trim() : undefined;
        const isActive =
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined;

        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const result = await this.brandService.getAllBrandsService(
          query,
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
      "getBrandsController"
    );
  };

  getBrandController = async (req: Request, res: Response): Promise<any> => {
    return tryCatchController(
      async () => {
        const brandId = req.params.id;
        const lang = req.lang || "vi";

        if (!isValidObjectId(brandId)) {
          return errorRes(
            res,
            req.__("INVALID_COLOR_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        const response = await this.brandService.getBrandService(
          brandId,
          lang,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getBrandController"
    );
  };
}
