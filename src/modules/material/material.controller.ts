import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import { handleValidationError } from "../../utils/helpers/validation.helper";
import { MaterialService, MaterialServiceImpl } from "./material.service";
import { materialValidate } from "./material.validate";
import { isValidObjectId } from "mongoose";
import { errorRes } from "../../utils/helpers/error-response.helper";
import HttpStatus from "../../utils/http-status.utils";

export class MaterialController {
  private readonly materialService: MaterialService;

  constructor() {
    this.materialService = new MaterialServiceImpl();
  }

  createMaterialController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const { error, value } = materialValidate.validate(req.body ?? {});

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.materialService.createMaterialService(
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "createMaterialController"
    );
  };

  getAllMaterialController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const lang = req.lang || "vi";

        const page = req.pagination?.page || 1;
        const limit = req.pagination?.limit || 12;

        const result = await this.materialService.getAllMaterialService(
          lang,
          req.__.bind(req),
          page,
          limit
        );
        return res.status(result.status_code).json(result);
      },
      res,
      req,
      "getAllMaterialController"
    );
  };

  updateMaterialController = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    return tryCatchController(
      async () => {
        const materialId = req.params.id;
        const { error, value } = materialValidate.validate(req.body ?? {});

        if (!isValidObjectId(materialId)) {
          return errorRes(
            res,
            req.__("INVALID_MATERIAL_ID"),
            HttpStatus.BAD_REQUEST
          );
        }

        if (error) {
          handleValidationError(res, error, req.__.bind(req));
          return;
        }

        const response = await this.materialService.updateMaterialService(
          materialId,
          value,
          req.__.bind(req)
        );

        res.status(response.status_code).json(response);
      },
      res,
      req,
      "updateMaterialController"
    );
  };
}
