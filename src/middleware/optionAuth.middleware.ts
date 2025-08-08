import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestCustom } from "../types/express";
import { IUserPayload } from "../types/user.type";

dotenv.config();

const optionalAuth = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    req.user = decoded as IUserPayload;
  } catch (error) {
    console.log("Invalid token, proceed as guest");
    req.user = null;
  }

  next();
};

export default optionalAuth;
