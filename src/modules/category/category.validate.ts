import Joi from "joi";

export const createCategoryValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "SIZE_NAME_STRING",
    "string.empty": "SIZE_NAME_EMPTY",
    "any.required": "SIZE_NAME_REQUIRED",
  }),
});

export const updateCategoryActiveValidate = Joi.object({
  isActive: Joi.boolean().required().empty().messages({
    "string.empty": "CATEGORY_ACTIVE_EMPTY",
    "any.required": "CATEGORY_ACTIVE_REQUIRED",
  }),
});

export const updateCategoryValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "CATEGORY_NAME_STRING",
    "string.empty": "CATEGORY_NAME_EMPTY",
    "any.required": "CATEGORY_NAME_REQUIRED",
  }),
  isActive: Joi.boolean().required().empty().messages({
    "string.empty": "CATEGORY_ACTIVE_EMPTY",
    "any.required": "CATEGORY_ACTIVE_REQUIRED",
  }),
});
