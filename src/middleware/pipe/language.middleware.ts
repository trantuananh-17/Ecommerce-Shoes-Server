import { Request, Response, NextFunction } from "express";

export const getLangFromHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lang = req.headers["accept-language"]?.split(",")[0] || "vi";
  req.lang = lang;
  next();
};
