import { Request, Response } from "express";
import { SizeService } from "./size.service";
import { sizeValidate } from "./size.validator";

export class SizeController {
  private readonly sizeService = new SizeService();

  create = async (req: Request, res: Response): Promise<any> => {
    try {
      const { error, value } = sizeValidate.validate(req.body);

      if (error) {
        const messageKey = error.details[0].message;
        return res.status(400).json({
          status_code: 400,
          message: req.__(messageKey),
        });
      }

      const result = await this.sizeService.create(value.name, req);
      res.status(result.status_code).json(result);
    } catch (err) {
      console.error("Error in SizeController.create:", err);
      res.status(500).json({
        status_code: 500,
        message: req.__("INTERNAL_SERVER_ERROR"),
        error: err,
      });
    }
  };
}
