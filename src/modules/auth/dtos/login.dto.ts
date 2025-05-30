export interface ILoginDto {
  email: string;
  password: string;
}

export interface ILoginResponseDto {
  id: string;
  email: string;
  fullname: string;
  role: string;
  avatar: string;
  token: {
    access_token: string;
    refresh_token: string;
  };
}
