import Joi from "joi";
import { IRegisterDto, IVerifyEmailDto } from "../dtos/register.dto";

export const RegisterValidator = Joi.object<IRegisterDto>({
  email: Joi.string().email().required().messages({
    "string.empty": "EMAIL_EMPTY",
    "string.email": "EMAIL_INVALID",
    "any.required": "EMAIL_REQUIRED",
  }),
  fullname: Joi.string().min(2).max(50).required().messages({
    "string.empty": "FULLNAME_EMPTY",
    "string.min": "FULLNAME_MIN_2",
    "string.max": "FULLNAME_MAX_50",
    "any.required": "FULLNAME_REQUIRED",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "PASSWORD_EMPTY",
    "string.min": "PASSWORD_MIN_6",
    "any.required": "PASSWORD_REQUIRED",
  }),
});

export const verifyEmailValidator = Joi.object<IVerifyEmailDto>({
  id: Joi.string().length(24).hex().messages({
    "string.length": "ID_INVALID_LENGTH",
    "string.hex": "ID_INVALID_FORMAT",
  }),

  token: Joi.string().min(10).required().messages({
    "string.empty": "TOKEN_EMPTY",
    "string.min": "TOKEN_MIN_10",
    "any.required": "TOKEN_REQUIRED",
  }),
});
