import { Gender } from "./models/user.model";

export interface IAuthInfoResponseDto {
  id: string;
  email: string;
  fullname: string;
  role: string;
  loginType: string;
}

export interface IUserInfoResponseDto {
  email: string;
  fullname?: string;
  role?: string;
  phoneNumber?: string;
  gender?: string;
  birth?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  avatar: {
    key: string;
    url: string;
  };
}

export interface IUserUpdateDto {
  fullname?: string;
  phoneNumber?: string;
  gender?: Gender;
  birth?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
}

export interface IUserActiveDto {
  isActive: boolean;
}
