
import { Response } from "express";
import HttpStatus from "../http-status.utils";

export const handleValidationError = (
  res: Response,
  error: any,
  translate: (key: string) => string
) => {
  const messageKey = error.details?.[0]?.message || "VALIDATION_ERROR";
  return res.status(HttpStatus.BAD_REQUEST).json({
    status_code: HttpStatus.BAD_REQUEST,
    message: translate(messageKey),
  });
};
