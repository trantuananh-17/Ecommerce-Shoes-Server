import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import UserModel from "./models/user.model";
import { IUserActiveDto, IUserInfoResponseDto } from "./user.dto";
import { userInfoResponseMapper } from "./user.mapper";

export interface IUserService {
  getProfileService(
    userId: string,
    __: TranslateFunction
  ): Promise<APIResponse<IUserInfoResponseDto | null>>;

  updateUserInfoService(
    userId: string,
    DTOUser: IUserInfoResponseDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteUserService(
    DTOUser: IUserActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;
}

export class UserServiceImpl implements IUserService {
  async getProfileService(
    userId: string,
    __: TranslateFunction
  ): Promise<APIResponse<IUserInfoResponseDto | null>> {
    return tryCatchService(
      async () => {
        const user = await UserModel.findOne({ _id: userId });

        if (user === null) {
          return apiError(HttpStatus.BAD_REQUEST, __("USER_NOT_EXIST"));
        }

        const userInfo: IUserInfoResponseDto = userInfoResponseMapper(user);

        return apiResponse(
          HttpStatus.OK,
          __("GET_USER_INFO_SUCCESSFULLY"),
          userInfo
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getProfileService",
      __
    );
  }
  async updateUserInfoService(
    userId: string,
    DTOUser: IUserInfoResponseDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    throw new Error("Method not implemented.");
  }
  async deleteUserService(
    DTOUser: IUserActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    throw new Error("Method not implemented.");
  }
}
