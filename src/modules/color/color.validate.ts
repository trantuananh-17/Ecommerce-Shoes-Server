import Joi from "joi";

export const colorValidate = Joi.object({
  name: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "COLOR_NAME_VI_EMPTY",
      "any.required": "COLOR_NAME_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "COLOR_NAME_EN_EMPTY",
      "any.required": "COLOR_NAME_EN_REQUIRED",
    }),
  })
    .required()
    .messages({
      "any.required": "COLOR_NAME_REQUIRED",
    }),
});

export const colorUpdateValidate = Joi.object({
  isActive: Joi.boolean().required().empty().messages({
    "string.empty": "COLOR_ACTIVE_EMPTY",
    "any.required": "COLOR_ACTIVE_REQUIRED",
  }),
});

export const colodIdsValidate = Joi.object({
  ids: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.base": "COLOR_IDS_ARRAY",
    "array.required": "COLOR_IDS_REQUIRED",
    "string.base": "COLOR_NAME_STRING",
    "string.empty": "COLOR_NAME_EMPTY",
    "any.required": "COLOR_NAME_REQUIRED",
  }),
});
