import Joi from "joi";

export const colorValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên màu không được để trống",
    "any.required": "Tên màu là bắt buộc",
  }),
});

export const colorUpdateValidate = Joi.object({
  isActive: Joi.boolean().required().empty().messages({
    "string.empty": "Giá trị trạng thái không được để trống",
    "any.required": "Giá trị trạng thái là bắt buộc",
  }),
});
