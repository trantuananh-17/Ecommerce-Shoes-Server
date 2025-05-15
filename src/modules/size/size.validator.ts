import Joi from "joi";

export const sizeValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "SIZE_NAME_STRING",
    "string.empty": "SIZE_NAME_EMPTY",
    "any.required": "SIZE_NAME_REQUIRED",
  }),
});

export const sizeIdsValidate = Joi.object({
  ids: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.base": "SIZE_IDS_ARRAY",
    "array.min": "SIZES_MIN",
    "array.required": "SIZE_IDS_REQUIRED",
    "string.base": "SIZE_NAME_STRING",
    "string.empty": "SIZE_NAME_EMPTY",
    "any.required": "SIZE_NAME_REQUIRED",
  }),
});
