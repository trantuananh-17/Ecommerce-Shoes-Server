import Joi from "joi";

export const createCategoryValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "SIZE_NAME_STRING",
    "string.empty": "SIZE_NAME_EMPTY",
    "any.required": "SIZE_NAME_REQUIRED",
  }),
});
