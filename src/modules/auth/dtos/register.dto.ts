export interface IRegisterResponseDto {
  id: string;
  email: string;
  fullname: string;
  createdAt: string;
}

export interface IRegisterDto {
  email: string;
  fullname: string;
  password: string;
}

export interface IVerifyEmailDto {
  id: string;
  token: string;
}
