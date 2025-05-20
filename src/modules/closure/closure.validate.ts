import Joi from "joi";

export const closureValidate = Joi.object({
  name: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "CLOSURE_NAME_VI_EMPTY",
      "any.required": "CLOSURE_NAME_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "CLOSURE_NAME_EN_EMPTY",
      "any.required": "CLOSURE_NAME_EN_REQUIRED",
    }),
  }).required(),
  description: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "CLOSURE_DESC_VI_EMPTY",
      "any.required": "CLOSURE_DESC_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "CLOSURE_DESC_EN_EMPTY",
      "any.required": "CLOSURE_DESC_EN_REQUIRED",
    }),
  }).required(),
});
