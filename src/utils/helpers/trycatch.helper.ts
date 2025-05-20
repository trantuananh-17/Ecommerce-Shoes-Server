import { apiError } from "./api-response.helper";
import HttpStatus from "../http-status.utils";
import { Request, Response } from "express";

export const tryCatchService = async (
  fn: Function,
  errorMessage: string,
  service: string,
  translate: Function
) => {
  try {
    return await fn();
  } catch (error: any) {
    console.log(`Error in ${service}:`, error);
    return apiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      translate(errorMessage),
      error
    );
  }
};

export const tryCatchController = async (
  fn: Function,
  res: Response,
  req: Request,
  controller: string
) => {
  try {
    await fn();
  } catch (error: any) {
    console.error(`Error in ${controller}:`, error);
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
