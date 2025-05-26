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

dotenv.config();

export interface JwtService {
  refreshTokenService(
    DTOToken: IRefreshTokenDto,
    __: TranslateFunction
  ): Promise<APIResponse<IRefreshTokenResponseDto | null>>;
}

export class JwtServiceImpl implements JwtService {
  refreshTokenService(
    DTOToken: IRefreshTokenDto,
    __: TranslateFunction
  ): Promise<APIResponse<IRefreshTokenResponseDto | null>> {
    return tryCatchService(
      async () => {
        const secretKey = process.env.SECRET_KEY;
        const { refresh_token } = DTOToken;

        if (!secretKey) {
          return apiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            __("SECRET_KEY_MISSING")
          );
        }

        let userInfo: TokenPayload;
        try {
          userInfo = jwt.verify(refresh_token, secretKey) as TokenPayload;
        } catch (err) {
          return apiError(HttpStatus.UNAUTHORIZED, __("UNAUTHORIZED"));
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
  }
}
