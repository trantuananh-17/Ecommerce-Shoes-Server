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

  getAllSizeController = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.sizeService.getAllSizesService(
        req.__.bind(req)
      );

      res.status(response.status_code).json(response);
    } catch (error: any) {
      console.error("Error in SizeController.getAllSizeController:", error);
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

  getAllSizesWithPaginationController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const lang = req.lang || "vi";

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const response = await this.sizeService.getAllSizesWithPaginationService(
        limit,
        page,
        lang,
        req.__.bind(req)
      );

      res.status(response.status_code).json(response);
    } catch (error: any) {
      console.error("Error in SizeController.getAllSizeController:", error);
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

  deleteSizeController = async (req: Request, res: Response): Promise<any> => {
    try {
      const sizeId = req.params.id;

      if (!isValidObjectId(sizeId)) {
        return errorRes(res, req.__("INVALID_SIZE_ID"), HttpStatus.BAD_REQUEST);
      }

      const response = await this.sizeService.deleteSizeService(
        sizeId,
        req.__.bind(req)
      );

      if (!response) {
        return errorRes(res, req.__("SIZE_NOT_FOUND"), HttpStatus.NOT_FOUND);
      }

      res.status(response.status_code).json(response);
    } catch (error: any) {
      console.error("Error in SizeController.deleteSizeController:", error);
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

  deleteManySizeController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "Vi";
        const { error, value } = sizeIdsValidate.validate(req.body ?? {});

        if (error) {
          return handleValidationError(res, error, req.__.bind(req)); // Nếu có lỗi validate
        }

        for (let sizeId of value.ids) {
          if (!isValidObjectId(sizeId)) {
            return errorRes(
              res,
              req.__("INVALID_SIZE_ID"),
              HttpStatus.BAD_REQUEST
            );
          }
        }

        // Gọi service để xóa nhiều kích thước
        const response = await this.sizeService.deleteManySizeService(
          value,
          lang,
          req.__.bind(req)
        );

        // Trả về kết quả xóa
        res.status(response.status_code).json(response);
      },
      res,
      req,
      "deleteManySizeController"
    );
  };
}
