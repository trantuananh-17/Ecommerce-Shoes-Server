import sharp from "sharp";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import UserModel from "./models/user.model";
import {
  IUserActiveDto,
  IUserInfoResponseDto,
  IUserUpdateDto,
} from "./user.dto";
import { userInfoResponseMapper } from "./user.mapper";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import s3 from "../../config/s3.config";
dotenv.config();

export interface IUserService {
  getProfileService(
    userId: string,
    __: TranslateFunction
  ): Promise<APIResponse<IUserInfoResponseDto | null>>;

  updateUserInfoService(
    userId: string,
    DTOUser: IUserUpdateDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  updateActiveUserService(
    userId: string,
    DTOUser: IUserActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  createAndUpdateAvatarUserService(
    userId: string,
    avatar: Express.Multer.File,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  deleteAvatarUserService(
    userId: string,
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
    DTOUser: IUserUpdateDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const {
          fullname,
          phoneNumber,
          gender,
          birth,
          province,
          district,
          ward,
          address,
        } = DTOUser;

        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
          return apiError(HttpStatus.NOT_FOUND, __("USER_NOT_FOUND"));
        }

        existingUser.fullname = fullname ?? existingUser.fullname;
        existingUser.phoneNumber = phoneNumber ?? existingUser.phoneNumber;
        existingUser.gender = gender ?? existingUser.gender;
        if (birth !== undefined) {
          existingUser.birth =
            typeof birth === "string" ? new Date(birth) : birth;
        }

        existingUser.province = province ?? existingUser.province;
        existingUser.district = district ?? existingUser.district;
        existingUser.ward = ward ?? existingUser.ward;
        existingUser.address = address ?? existingUser.address;

        await existingUser.save();

        return apiResponse(HttpStatus.OK, __("USER_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateUserInfoService",
      __
    );
  }

  async updateActiveUserService(
    userId: string,
    DTOUser: IUserActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { isActive } = DTOUser;

        const updated = await UserModel.findByIdAndUpdate(
          userId,
          { isActive: isActive },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("USER_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("USER_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateActiveUserService",
      __
    );
  }

  async createAndUpdateAvatarUserService(
    userId: string,
    avatar: Express.Multer.File,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

        if (!fileTypes.includes(avatar.mimetype)) {
          return apiResponse(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "Invalid image file type!"
          );
        }

        const user = await UserModel.findById(userId);
        const bucketName = process.env.AWS_NAME;

        if (user) {
          if (user.avatar && user.avatar.id) {
            const key = user.avatar.id;
            await s3
              .deleteObject({
                Bucket: bucketName!,
                Key: key,
              })
              .promise();
          }

          const resizedImageBuffer = await sharp(avatar.buffer)
            .resize({ width: 300, height: 300, fit: "contain" })
            .toBuffer();

          if (bucketName) {
            const id = uuidv4();
            const key = `uploads/${id}-${avatar.originalname}`;

            const params = {
              Bucket: bucketName,
              Key: key,
              Body: resizedImageBuffer,
              ContentType: avatar.mimetype,
              ACL: "public-read",
            };

            const uploadResult = await s3.upload(params).promise();

            user.avatar = {
              url: uploadResult.Location,
              id: key,
            };
            await user.save();
            return apiResponse(
              HttpStatus.OK,
              __("USER_AVATAR_UPDATED_SUCCESSFULLY"),
              uploadResult.Location
            );
          }
        }
      },
      "INTERNAL_SERVER_ERROR",
      "createAndUpdateAvatarUserService",
      __
    );
  }

  async deleteAvatarUserService(
    userId: string,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const bucketName = process.env.AWS_NAME;
        const user = await UserModel.findById(userId);

        if (user) {
          if (user.avatar && user.avatar.id) {
            const key = user?.avatar?.id;
            await s3
              .deleteObject({
                Bucket: bucketName!,
                Key: key,
              })
              .promise();
          }

          user.avatar = undefined;
          await user.save();

          return apiResponse(
            HttpStatus.OK,
            __("USER_AVATAR_DELETED_SUCCESSFULLY")
          );
        }
      },
      "INTERNAL_SERVER_ERROR",
      "deleteAvatarUserService",
      __
    );
  }
}
