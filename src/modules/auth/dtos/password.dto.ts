export interface IChangePasswordMeDto {
  newPassword: string;
  currentPassword: string;
}

export interface IForgotPasswordMeDto {
  email: string;
}

export interface IResetPassswordDto {\
  id: string;
  token: string;
  newPassword: string;
}
