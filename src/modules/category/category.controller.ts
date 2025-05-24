import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { CategoryService, CategoryServiceImpl } from "./category.service";
import {
  createCategoryValidate,
  updateCategoryActiveValidate,
  updateCategoryValidate,
} from "./category.validate";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";

export class CategoryController {
  private readonly categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryServiceImpl();
  }

  createCategoryController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = createCategoryValidate.validate(
          req.body ?? {}
        );
        const lang = req.lang || "vi";

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.categoryService.createCategoryService(
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createCategoryController"
    );
  };

  updateCategoryActiveController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const categoryId = req.params.id;
        const { error, value } = updateCategoryActiveValidate.validate(
          req.body ?? {}
        );

        if (!isValidObjectId(categoryId)) {
          return errorRes(
            res,
            req.__("INVALID_COLOR_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.categoryService.updateCategoryActiveService(
          categoryId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateCategoryController"
    );
  };

  updateCategoryController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const categoryId = req.params.id;
        const { error, value } = updateCategoryValidate.validate(
          req.body ?? {}
        );

        if (!isValidObjectId(categoryId)) {
          return errorRes(
            res,
            req.__("INVALID_COLOR_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.categoryService.updateCategoryService(
          categoryId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateCategoryController"
    );
  };

  getAllCategoryController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const isActive =
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined;

        const result = await this.categoryService.getAllCategoryService(
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
      "getAllCategoryController"
    );
  };
}
