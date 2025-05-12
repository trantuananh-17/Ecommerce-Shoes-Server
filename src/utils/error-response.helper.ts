import { Response } from "express";

export const errorRes = (
  res: Response,
  message: string,
  statusCode: number
) => {
  res.status(statusCode).json({ message });
};
