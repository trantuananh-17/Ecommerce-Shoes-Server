import Joi from "joi";

export const materialValidate = Joi.object({
  name: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "MATERIAL_NAME_VI_EMPTY",
      "any.required": "MATERIAL_NAME_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "MATERIAL_NAME_EN_EMPTY",
      "any.required": "MATERIAL_NAME_EN_REQUIRED",
    }),
  }).required(),
  description: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "MATERIAL_DESC_VI_EMPTY",
      "any.required": "MATERIAL_DESC_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "MATERIAL_DESC_EN_EMPTY",
      "any.required": "MATERIAL_DESC_EN_REQUIRED",
    }),
  }).required(),
});
