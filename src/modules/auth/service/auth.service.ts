import { TranslateFunction } from "../../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../../utils/helpers/trycatch.helper";
import HttpStatus from "../../../utils/http-status.utils";
import TokenModel from "../../token/token.model";
import { TokenType } from "../../token/token.model";
import UserModel from "../../user/models/user.model";
import { registerUserMapper } from "../auth.mapper";
import {
  IRegisterDto,
  IRegisterResponseDto,
  IVerifyEmailDto,
} from "../dtos/register.dto";
import brcypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendVerification } from "./mail.service";

dotenv.config();

export interface AuthService {
  registerUserService(
    DTOUser: IRegisterDto,
    __: TranslateFunction
  ): Promise<APIResponse<IRegisterResponseDto | null>>;

  // loginUserService(): Promise<APIResponse<null>>;

  verifyEmail(
    DTOVerify: IVerifyEmailDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;
}

export class AuthServiceImpl implements AuthService {
  async registerUserService(
    DTOUser: IRegisterDto,
    __: TranslateFunction
  ): Promise<APIResponse<IRegisterResponseDto | null>> {
    return tryCatchService(
      async () => {
        const { email, fullname, password } = DTOUser;

        const existedUser = await UserModel.findOne({
          email: email,
        });

        if (existedUser !== null) {
          return apiError(
            HttpStatus.CONFLICT,
            __("EMAIL_OF_USER_ALREADY_EXISTS")
          );
        }

        const hash = brcypt.hashSync(password, 10);
        const newUser = new UserModel({ email, fullname, password: hash });
        const createdUser = await newUser.save();
        const response: IRegisterResponseDto = registerUserMapper(createdUser);

        const token = crypto.randomBytes(36).toString("hex");
        const type = TokenType.VERIFY;
        const newToken = new TokenModel({
          user: response.id,
          token,
          type,
        });
        await newToken.save();

        const link = `${process.env.API_URL}/verify?id=${response.id}&token=${token}`;

        console.log(link);

        await sendVerification(response.email, link);
        return apiResponse(
          HttpStatus.CREATED,
          __("PLEASE_VERIFY_EMAIL"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "registerUserService",
      __
    );
  }

  async verifyEmail(
    DTOVerify: IVerifyEmailDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { id, token } = DTOVerify;

        const authToken = await TokenModel.findOne({ user: id });

        console.log(authToken);

        if (!authToken) {
          return apiError(HttpStatus.FORBIDDEN, __("UNAUTHORIZED"));
        }

        const isMatched = await authToken.compareToken(token);

        console.log(isMatched);

        if (!isMatched) {
          return apiError(
            HttpStatus.FORBIDDEN,
            __("UNAUTHORIZED_DUE_INVALID_TOKEN")
          );
        }

        await UserModel.findByIdAndUpdate(id, { verified: true });

        await TokenModel.findByIdAndDelete(authToken._id);

        return apiResponse(HttpStatus.OK, __("EMAIL_IS_VERIFIED"));
      },
      "INTERNAL_SERVER_ERROR",
      "verifyEmailService",
      __
    );
  }
}
