import Joi from "joi";
import { Gender } from "./models/user.model";

export const userInfoValidate = Joi.object({
  fullname: Joi.string().trim().optional().messages({
    "string.base": "FULLNAME_MUST_BE_STRING",
    "string.empty": "FULLNAME_EMPTY",
  }),
  phoneNumber: Joi.string()
    .trim()
    .optional()
    .pattern(/^[0-9]+$/)
    .messages({
      "string.pattern.base": "PHONE_NUMBER_INVALID",
      "string.empty": "PHONE_NUMBER_EMPTY",
      "string.base": "PHONE_NUMBER_MUST_BE_STRING",
    }),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .optional()
    .messages({
      "any.only": "GENDER_INVALID",
      "string.empty": "GENDER_EMPTY",
    }),
  birth: Joi.string().optional().isoDate().messages({
    "string.empty": "BIRTH_EMPTY",
    "string.base": "BIRTH_MUST_BE_STRING",
  }),
  province: Joi.string().trim().optional().messages({
    "string.base": "PROVINCE_MUST_BE_STRING",
    "string.empty": "PROVINCE_EMPTY",
  }),
  district: Joi.string().trim().optional().messages({
    "string.base": "DISTRICT_MUST_BE_STRING",
    "string.empty": "DISTRICT_EMPTY",
  }),
  ward: Joi.string().trim().optional().messages({
    "string.base": "WARD_MUST_BE_STRING",
    "string.empty": "WARD_EMPTY",
  }),
  address: Joi.string().trim().optional().messages({
    "string.base": "ADDRESS_MUST_BE_STRING",
    "string.empty": "ADDRESS_EMPTY",
  }),
});

export const userActiveValidate = Joi.object({
  isActive: Joi.boolean().required().messages({
    "boolean.base": "IS_ACTIVE_MUST_BE_BOOLEAN",
    "any.required": "IS_ACTIVE_REQUIRED",
  }),
});
