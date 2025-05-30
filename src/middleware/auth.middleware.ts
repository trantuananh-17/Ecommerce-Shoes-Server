import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import HttpStatus from "../utils/http-status.utils";
import { TranslateFunction } from "../types/express";
import { TokenPayload } from "../modules/auth/helper/token.helper";
import { Role } from "../modules/user/models/user.model";
dotenv.config();

const handleUnauthorizedError = (res: Response, __: TranslateFunction) => {
  return res.status(HttpStatus.UNAUTHORIZED).json({
    status: HttpStatus.UNAUTHORIZED,
    message: __("UNAUTHORIZED"),
    data: null,
  });
};

const AuthRole = (
  role: string,
  isAuthMe: boolean = false,
  isPublic: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split("Bearer ")[1];

      if (isPublic) {
        next();
      }

      if (!token) {
        res.status(401).json({ messag: "Ban chua dang nhap" });
        return;
      }

      const secretKey = process.env.SECRET_KEY;

      if (secretKey) {
        jwt.verify(token, secretKey, (error: unknown, data) => {
          if (error || !data) {
            return handleUnauthorizedError(res, req.__.bind(req));
          }

          const user = data as TokenPayload;

          const hasRole =
            role === "*" || // Cả user và admin
            user.role.includes(role) || // người dùng có role cần thiết
            user.role.includes(Role.ADMIN) || // hoặc là admin
            (isAuthMe && req.params?.id === user.id); // hoặc là chính người dùng (nếu cho phép)

          if (hasRole) {
            req.userId = user.id;
            next();
          } else {
            return handleUnauthorizedError(res, req.__.bind(req));
          }
        });
      }
    } catch (error) {
      console.error("AuthRole middleware error:", error);
      handleUnauthorizedError(res, req.__.bind(req));
    }
  };
};

export default AuthRole;
