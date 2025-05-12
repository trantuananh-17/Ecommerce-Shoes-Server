import Joi from "joi";

export const colorValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên màu không được để trống",
    "any.required": "Tên màu là bắt buộc",
  }),
});
