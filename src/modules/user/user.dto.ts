export interface IAuthInfoResponseDto {
  id: string;
  email: string;
  fullname: string;
  role: string;
  loginType: string;
}

export interface IUserInfoResponseDto {
  id: string;
  email: string;
  fullname: string;
  role: string;
  phoneNumber: string;
  gender: string;
  birth: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  avatar: string;
  loginType: string;
}

export interface IUserActiveDto {
  isActive: boolean;
}
