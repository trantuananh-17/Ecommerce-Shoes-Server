import { IUser } from "./models/user.model";
import { IUserInfoResponseDto } from "./user.dto";

export const userInfoResponseMapper = (user: IUser): IUserInfoResponseDto => {
  return {
    id: user._id.toString(),
    email: user.email,
    fullname: user.fullname,
    role: user.role,
    phoneNumber: user.phoneNumber || "",
    gender: user.gender || "",
    birth: user.birth?.toLocaleString() || "",
    province: user.province || "",
    district: user.district || "",
    ward: user.ward || "",
    address: user.address || "",
    avatar: user.avatar?.url || "",
    loginType: user.loginType || "",
  };
};
