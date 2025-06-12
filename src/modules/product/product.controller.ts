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

  getAllProductController = async (req: Request, res: Response) => {
    tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        // Lấy giá trị isActive từ query params
        const isActive =
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined;

        // Lấy page và limit từ pagination
        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        // Lọc các giá trị từ query
        const filters: any = {};

        // Lọc theo gender (nếu có)
        if (req.query.gender) {
          filters.gender = req.query.gender;
        }

        // Lọc theo category (nếu có)
        if (req.query.category) {
          filters.category = req.query.category;
        }

        // Lọc theo brand (nếu có)
        if (req.query.brand) {
          filters.brand = req.query.brand;
        }

        // Lọc theo material (nếu có)
        if (req.query.material) {
          filters.material = req.query.material;
        }

        // Lọc theo color (nếu có)
        if (req.query.color) {
          filters.color = req.query.color;
        }

        // Lọc theo closure (nếu có)
        if (req.query.closure) {
          filters.closure = req.query.closure;
        }

        // Lọc theo searchText (nếu có)
        if (req.query.searchText) {
          filters.searchText = req.query.searchText;
        }

        // Gọi service để lấy dữ liệu sản phẩm
        const result = await this.productService.getProductsService(
          lang,
          req.__.bind(req),
          page,
          limit,
          isActive,
          filters // Truyền filters vào
        );

        // Trả về kết quả dưới dạng JSON
        return res.status(result.status_code).json(result);
      },
      res,
      req,
      "getAllDiscountController"
    );
  };
}
