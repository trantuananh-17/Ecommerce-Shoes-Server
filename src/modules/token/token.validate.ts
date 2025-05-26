import Joi from "joi";

export const tokenSchema = Joi.object({
  refresh_token: Joi.string().trim().required().messages({
    "string.base": "REFRESH_TOKEN_MUST_BE_A_STRING",
    "string.empty": "REFRESH_TOKEN_CANNOT_BE_EMPTY",
    "any.required": "REFRESH_TOKEN_IS_REQUIRED",
  }),
});
