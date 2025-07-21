import { NextFunction, Response } from "express";
import { RequestCustom } from "../types/express";
import { IUserPayload } from "../types/user.type";
import HttpStatus from "../utils/http-status.utils";

const roleMiddleware = (roles: string[]): any => {
  return (req: RequestCustom, res: Response, next: NextFunction) => {
    const { role } = req.user as IUserPayload;

    if (!roles.includes(role)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Bạn không có quyền truy cập!" });
    }

    next();
  };
};

export default roleMiddleware;
