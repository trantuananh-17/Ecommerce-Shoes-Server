import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { ProductService, ProductServiceImpl } from "./product.service";
import {
  productCreateValidate,
  productUpdateValidate,
  sizeQuantityArraySchema,
} from "./product.validate";

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
          console.log(productData, sizeQuantityData);
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
          console.log(productData, sizeQuantityData);
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
}
