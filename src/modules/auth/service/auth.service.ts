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
import UserModel, { UserType } from "../../user/models/user.model";
import { registerUserMapper } from "../auth.mapper";
import {
  IRegisterDto,
  IRegisterResponseDto,
  IVerifyEmailDto,
} from "../dtos/register.dto";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendMailReset, sendVerification } from "./mail.service";
import {
  IChangePasswordMeDto,
  IForgotPasswordMeDto,
  IResetPassswordDto,
} from "../dtos/password.dto";

dotenv.config();

export interface AuthService {
  registerUserService(
    DTOUser: IRegisterDto,
    __: TranslateFunction
  ): Promise<APIResponse<IRegisterResponseDto | null>>;

  // loginUserService(): Promise<APIResponse<null>>;

  verifyEmailService(
    DTOVerify: IVerifyEmailDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  changePasswordMeService(
    id: string,
    DTOChangePassword: IChangePasswordMeDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  forgotPasswordService(
    DTOForgotPassword: IForgotPasswordMeDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  resetPasswordService(
    DTOResetPasswrod: IResetPassswordDto,
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

        const hash = await bcrypt.hash(password, 10);
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

  async verifyEmailService(
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

  async changePasswordMeService(
    id: string,
    DTOChangePassword: IChangePasswordMeDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const checkUser = await UserModel.findOne({ _id: id });

        if (checkUser === null) {
          return apiError(HttpStatus.NOT_FOUND, __("USER_NOT_FOUND"));
        }

        const { newPassword, currentPassword } = DTOChangePassword;
        const comparePassword = await bcrypt.compare(
          newPassword,
          checkUser?.password
        );
        const compareCurrentPassword = await bcrypt.compare(
          currentPassword,
          checkUser.password
        );

        if (!compareCurrentPassword) {
          return apiError(
            HttpStatus.CONFLICT,
            __("THE_CURRENT_PASSWORD_WRONG")
          );
        }

        if (comparePassword) {
          return apiError(
            HttpStatus.CONFLICT,
            __("THE_NEW_PASSWORD_MUST_BE_DIFFERENT")
          );
        }

        const hash = await bcrypt.hash(newPassword, 10);

        checkUser.password = hash;
        await checkUser.save();
        return apiResponse(HttpStatus.OK, __("PASSWORD_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "ChangePasswordMelService",
      __
    );
  }

  async forgotPasswordService(
    DTOForgotPassword: IForgotPasswordMeDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { email } = DTOForgotPassword;
        const checkUser = await UserModel.findOne({ email: email }).select(
          "-password"
        );

        if (checkUser === null) {
          return apiError(HttpStatus.NOT_FOUND, __("USER_NOT_FOUND"));
        }

        const token = crypto.randomBytes(36).toString("hex");
        const type = TokenType.RESET;

        const newToken = new TokenModel({
          user: checkUser._id,
          token,
          type,
        });
        await newToken.save();

        const link = `${process.env.CLIENT_URL}/reset-password?id=${checkUser._id}&token=${token}`;
        await sendMailReset(email, link);

        return apiResponse(HttpStatus.CREATED, __("PLEASE_VERIFY_EMAIL"));
      },
      "INTERNAL_SERVER_ERROR",
      "forgotPasswordService",
      __
    );
  }

  async resetPasswordService(
    DTOResetPasswrod: IResetPassswordDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { id, token, newPassword } = DTOResetPasswrod;

        const authToken = await TokenModel.findOne({ user: id });

        if (!authToken) {
          return apiError(HttpStatus.FORBIDDEN, __("UNAUTHORIZED"));
        }

        const isMatched = await authToken.compareToken(token);

        if (!isMatched) {
          return apiError(
            HttpStatus.FORBIDDEN,
            __("UNAUTHORIZED_DUE_INVALID_TOKEN")
          );
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await UserModel.findByIdAndUpdate(id, { password: hash });

        await TokenModel.findByIdAndDelete(authToken._id);

        return apiResponse(HttpStatus.OK, __("PASSWORD_RESET_SUCCESS"));
      },
      "INTERNAL_SERVER_ERROR",
      "resetPasswordService",
      __
    );
  }
}
