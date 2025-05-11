import Joi from "joi";
import { RegisterDto } from "../dtos/register.dto";

export const RegisterValidator = Joi.object<RegisterDto>({
  fullname: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
