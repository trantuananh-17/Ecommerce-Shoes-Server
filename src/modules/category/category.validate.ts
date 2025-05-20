import Joi from "joi";

export const createCategoryValidate = Joi.object({
  name: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.base": "CATEGORY_NAME_VI_STRING",
      "string.empty": "CATEGORY_NAME_VI_EMPTY",
      "any.required": "CATEGORY_NAME_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.base": "CATEGORY_NAME_EN_STRING",
      "string.empty": "CATEGORY_NAME_EN_EMPTY",
      "any.required": "CATEGORY_NAME_EN_REQUIRED",
    }),
  })
    .required()
    .messages({
      "any.required": "CATEGORY_NAME_REQUIRED",
    }),
});

export const updateCategoryActiveValidate = Joi.object({
  isActive: Joi.boolean().required().empty().messages({
    "string.empty": "CATEGORY_ACTIVE_EMPTY",
    "any.required": "CATEGORY_ACTIVE_REQUIRED",
  }),
});

export const updateCategoryValidate = Joi.object({
  name: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.base": "CATEGORY_NAME_VI_STRING",
      "string.empty": "CATEGORY_NAME_VI_EMPTY",
      "any.required": "CATEGORY_NAME_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.base": "CATEGORY_NAME_EN_STRING",
      "string.empty": "CATEGORY_NAME_EN_EMPTY",
      "any.required": "CATEGORY_NAME_EN_REQUIRED",
    }),
  })
    .required()
    .messages({
      "any.required": "CATEGORY_NAME_REQUIRED",
    }),
  isActive: Joi.boolean().required().messages({
    "any.required": "CATEGORY_ACTIVE_REQUIRED",
  }),
});
