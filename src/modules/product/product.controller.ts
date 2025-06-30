import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { ProductService, ProductServiceImpl } from "./product.service";
import {
  productCreateValidate,
  productUpdateValidate,
  sizeQuantityArraySchema,
  updateProductActiveValidate,
} from "./product.validate";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";
import { handleValidationError } from "../../utils/helpers/validation.helper";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductServiceImpl();
  }

  createProductController = async (
    req: MulterRequest,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const files = req.files as unknown as Express.Multer.File[];

        if (!files) {
          res.status(400).send("No file uploaded.");
          return;
        }

        let productData, sizeQuantityData;

        try {
          productData = JSON.parse(req.body.product);
          sizeQuantityData = JSON.parse(req.body.sizeQuantity);
        } catch (e) {
          return res.status(400).json({ message: "INVALID_JSON_FORMAT" });
        }

        const { error: productError } =
          productCreateValidate.validate(productData);
        if (productError) {
          return res
            .status(400)
            .json({ message: productError.details[0].message });
        }

        const { error: sizeError } =
          sizeQuantityArraySchema.validate(sizeQuantityData);
        if (sizeError) {
          return res
            .status(400)
            .json({ message: sizeError.details[0].message });
        }

        const response = await this.productService.createProductService(
          productData,
          files,
          sizeQuantityData,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createProductController"
    );
  };

  updateProductController = async (
    req: MulterRequest,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const id = req.params.id;

        const files = req.files as unknown as Express.Multer.File[];

        if (!files) {
          res.status(400).send("No file uploaded.");
          return;
        }

        let productData, sizeQuantityData;

        try {
          productData = JSON.parse(req.body.product);
          sizeQuantityData = JSON.parse(req.body.sizeQuantity);
        } catch (e) {
          return res.status(400).json({ message: "INVALID_JSON_FORMAT" });
        }

        const { error: productError } =
          productUpdateValidate.validate(productData);
        if (productError) {
          return res
            .status(400)
            .json({ message: productError.details[0].message });
        }

        const { error: sizeError } =
          sizeQuantityArraySchema.validate(sizeQuantityData);
        if (sizeError) {
          console.log(sizeError);

          return res
            .status(400)
            .json({ message: sizeError.details[0].message });
        }

        const response = await this.productService.updateProductService(
          id,
          productData,
          files,
          sizeQuantityData,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateProductController"
    );
  };

  updateProductActiveController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const productId = req.params.id;
        const { error, value } = updateProductActiveValidate.validate(
          req.body ?? {}
        );

        if (!isValidObjectId(productId)) {
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

        const response = await this.productService.updateProductActiveService(
          productId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateProductActiveController"
    );
  };

  getAllProductController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const userId = req.userId;

        const isActive =
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined;

        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const filters: any = {};

        if (req.query.gender) {
          filters.gender = req.query.gender;
        }

        if (req.query.category) {
          filters.category = req.query.category;
        }

        if (req.query.brand) {
          filters.brand = req.query.brand;
        }

        if (req.query.searchText) {
          filters.searchText = req.query.searchText;
        }

        if (req.query.sortBy) {
          filters.sortBy = req.query.sortBy;
        }

        const response = await this.productService.getProductsService(
          lang,
          req.__.bind(req),
          page,
          limit,
          isActive,
          filters,
          userId
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllProductController"
    );
  };

  getAllProductAdminController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const isActive =
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined;

        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const filters: any = {};

        if (req.query.gender) {
          filters.gender = req.query.gender;
        }

        if (req.query.brand) {
          filters.brand = req.query.brand;
        }

        if (req.query.searchText) {
          filters.searchText = req.query.searchText;
        }

        if (req.query.sortBy) {
          filters.sortBy = req.query.sortBy;
        }

        const response = await this.productService.getAdminProductListService(
          lang,
          req.__.bind(req),
          page,
          limit,
          isActive,
          filters
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getAllProductAdminController"
    );
  };

  getDetailProductBySlugController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const slug = req.params.slug;
        const userId = req.userId;

        const response = await this.productService.getDetailProductBySlugServie(
          lang,
          slug,
          req.__.bind(req),
          userId
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getDetailProductBySlugController"
    );
  };

  getDetailProductByIdController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const lang = req.lang || "vi";
        const productId = req.params.id;

        const response = await this.productService.getDetailProductByIdServie(
          lang,
          productId,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "getDetailProductBySlugController"
    );
  };
}
