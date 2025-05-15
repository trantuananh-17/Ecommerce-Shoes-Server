import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { CategoryService, CategoryServiceImpl } from "./category.service";
import { createCategoryValidate } from "./category.validate";
import { handleValidationError } from "../../utils/helpers/validation.helper";

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
          lang,
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
      async () => {},
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

        const { active } = req.query;

        const filter = active !== undefined ? active === "true" : undefined;

        const response = await this.categoryService.getAllCategoryService(
          lang,
          req.__.bind(req),
          filter
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllCategoryController"
    );
  };

  deleteCategoryController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(async () => {}, res, req, "deleteCategory");
  };

  deleteManyCategoryController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(async () => {}, res, req, "deleteManyCategory");
  };
}
