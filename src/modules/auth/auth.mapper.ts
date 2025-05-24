import { IUser } from "../user/models/user.model";
import { IRegisterResponseDto } from "./dtos/register.dto";

export const registerUserMapper = (userInfo: IUser): IRegisterResponseDto => {
  return {
    id: userInfo._id.toString(),
    email: userInfo.email,
    fullname: userInfo.fullname,
    createdAt: userInfo.createdAt.toISOString(),
  };
};
