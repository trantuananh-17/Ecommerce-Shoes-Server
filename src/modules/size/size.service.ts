import { apiError, apiResponse } from "../../utils/api-response.helper";
import SizeModel from "./size.model";
import { Request } from "express";

export class SizeService {
  async create(name: string, req: Request) {
    try {
      const existingSize = await SizeModel.findOne({ name });
      if (existingSize) {
        return apiError(400, req.__("SIZE_ALREADY_EXISTS"));
      }

      const created = await SizeModel.create({ name });
      return apiResponse(201, req.__("SIZE_CREATED"), created);
    } catch (error: any) {
      return apiError(500, req.__("INTERNAL_SERVER_ERROR"), error);
    }
  }
}
