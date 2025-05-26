import Joi from "joi";
import { ILoginDto } from "../dtos/login.dto";

export const LoginValidator = Joi.object<ILoginDto>({
  email: Joi.string().email().required().messages({
    "string.empty": "EMAIL_EMPTY",
    "string.email": "EMAIL_INVALID",
    "any.required": "EMAIL_REQUIRED",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "PASSWORD_EMPTY",
    "string.min": "PASSWORD_MIN_6",
    "any.required": "PASSWORD_REQUIRED",
  }),
});
