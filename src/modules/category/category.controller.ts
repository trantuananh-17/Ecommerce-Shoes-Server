import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { CategoryService } from "./category.service";

export class CategoryController {
  private readonly categoryService = new CategoryService();

  createCategoryController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {},
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
      async () => {},
      res,
      req,
      "getAllCategoryController"
    );
  };

  getAllCategoryActiveController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {},
      res,
      req,
      "getAllCategoryActiveController"
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
