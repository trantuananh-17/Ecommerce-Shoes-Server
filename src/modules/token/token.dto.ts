export interface IRefreshTokenResponseDto {
  access_token: string;
  refresh_token?: string;
}

export interface IRefreshTokenDto {
  refresh_token: string;
}
