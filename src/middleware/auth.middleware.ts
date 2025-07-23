import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestCustom } from "../types/express";
import { IUserPayload } from "../types/user.type";
import HttpStatus from "../utils/http-status.utils";

dotenv.config();

const authMiddleware = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Bạn chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);

    req.user = decoded as IUserPayload;

    console.log(req.user);

    next();
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Token không hợp lệ" });
  }
};

export default authMiddleware;
