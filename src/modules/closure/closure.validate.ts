import Joi from "joi";

export const closureValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "CLOSURE_NAME_STRING",
    "string.empty": "CLOSURE_NAME_EMPTY",
    "any.required": "CLOSURE_NAME_REQUIRED",
  }),
  description: Joi.string().trim().required().messages({
    "string.base": "CLOSURE_NAME_STRING",
    "string.empty": "CLOSURE_NAME_EMPTY",
    "any.required": "CLOSURE_NAME_REQUIRED",
  }),
});
