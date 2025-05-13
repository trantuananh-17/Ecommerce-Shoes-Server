import Joi from "joi";

export const bannedValidate = Joi.object({
  word: Joi.string().trim().required().messages({
    "string.empty": "Từ khóa không được để trống",
    "any.required": "Từ khóa là bắt buộc",
  }),
});
