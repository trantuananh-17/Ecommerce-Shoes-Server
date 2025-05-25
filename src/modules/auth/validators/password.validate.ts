import Joi from "joi";
import {
  IChangePasswordMeDto,
  IForgotPasswordMeDto,
  IResetPassswordDto,
} from "../dtos/password.dto";

export const changePasswordValidate = Joi.object<IChangePasswordMeDto>({
  currentPassword: Joi.string().required().messages({
    "string.empty": "CURRENT_PASSWORD_EMPTY",
    "any.required": "CURRENT_PASSWORD_REQUIRED",
  }),

  newPassword: Joi.string().required().messages({
    "string.empty": "NEW_PASSWORD_EMPTY",
    "any.required": "NEW_PASSWORD_REQUIRED",
  }),
});

export const forgotPasswordValidate = Joi.object<IForgotPasswordMeDto>({
  email: Joi.string().email().required().messages({
    "string.empty": "EMAIL_EMPTY",
    "string.email": "EMAIL_INVALID",
    "any.required": "EMAIL_REQUIRED",
  }),
});

export const resetPasswordValidate = Joi.object<IResetPassswordDto>({
  id: Joi.string().length(24).hex().messages({
    "string.length": "ID_INVALID_LENGTH",
    "string.hex": "ID_INVALID_FORMAT",
  }),
  token: Joi.string().min(10).required().messages({
    "string.empty": "TOKEN_EMPTY",
    "string.min": "TOKEN_MIN_10",
    "any.required": "TOKEN_REQUIRED",
  }),
  newPassword: Joi.string().required().messages({
    "string.empty": "NEW_PASSWORD_EMPTY",
    "any.required": "NEW_PASSWORD_REQUIRED",
  }),
});
