import jwt from "jsonwebtoken";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import { IRefreshTokenDto, IRefreshTokenResponseDto } from "./token.dto";
import dotenv from "dotenv";
import HttpStatus from "../../utils/http-status.utils";
import { generateToken, TokenPayload } from "../auth/helper/token.helper";
import UserModel from "../user/models/user.model";
import { Request } from "express";

dotenv.config();

export interface JwtService {
  refreshTokenService(
    req: Request,
    __: TranslateFunction
  ): Promise<APIResponse<IRefreshTokenResponseDto | null>>;
}

export class JwtServiceImpl implements JwtService {
  refreshTokenService = async (
    req: Request,
    __: TranslateFunction
  ): Promise<APIResponse<IRefreshTokenResponseDto | null>> => {
    return tryCatchService(
      async () => {
        const secretKey = process.env.SECRET_KEY;
        const refresh_token = req.cookies?.refresh_token;

        if (!secretKey) {
          return apiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            __("SECRET_KEY_MISSING")
          );
        }

        if (!refresh_token) {
          return apiError(HttpStatus.UNAUTHORIZED, __("REFRESH_TOKEN_MISSING"));
        }

        let userInfo: TokenPayload;
        try {
          userInfo = jwt.verify(refresh_token, secretKey) as TokenPayload;
        } catch (err) {
          return apiError(
            HttpStatus.UNAUTHORIZED,
            __("INVALID_OR_EXPIRED_REFRESH_TOKEN")
          );
        }

        const user = await UserModel.findById(userInfo.id);

        if (!user || !user.refreshTokens.includes(refresh_token)) {
          return apiError(HttpStatus.UNAUTHORIZED, __("INVALID_REFRESH_TOKEN"));
        }

        const tokenPayload = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          loginType: user.loginType,
        };

        const accessToken = await generateToken(tokenPayload, secretKey, "15m");
        const newRefreshToken = await generateToken(
          tokenPayload,
          secretKey,
          "7d"
        );

        user.refreshTokens = user.refreshTokens.filter(
          (t) => t !== refresh_token
        );
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        // // Gán refresh_token mới vào cookie
        // req.res?.cookie("refresh_token", newRefreshToken, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "none",
        //   path: "/",
        //   maxAge: 7 * 24 * 60 * 60 * 1000,
        // });

        const response: IRefreshTokenResponseDto = {
          access_token: accessToken,
          refresh_token: newRefreshToken,
        };

        return apiResponse(HttpStatus.OK, __("TOKEN_REFRESHED"), response);
      },
      "INTERNAL_SERVER_ERROR",
      "refreshToken",
      __
    );
  };
}
