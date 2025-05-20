import Joi from "joi";

export const bannedValidate = Joi.object({
  word: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "BANNED_VI_EMPTY",
      "any.required": "BANNED_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "BANNED_EN_EMPTY",
      "any.required": "BANNED_EN_REQUIRED",
    }),
  })
    .required()
    .messages({
      "any.required": "BANNED_WORD_REQUIRED",
    }),
});

export const bannedWordIdsValidate = Joi.object({
  ids: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.base": "BANNED_IDS_ARRAY",
    "array.min": "BANNED_MIN",
    "array.required": "BANNED_IDS_REQUIRED",
    "string.base": "BANNED_NAME_STRING",
    "string.empty": "BANNED_NAME_EMPTY",
    "any.required": "BANNED_NAME_REQUIRED",
  }),
});
