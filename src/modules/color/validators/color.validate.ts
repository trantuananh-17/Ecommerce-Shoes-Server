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

export const colodIdsValidate = Joi.object({
  ids: Joi.array().items(Joi.string().required()).min(1).required().messages({
    "array.base": "COLOR_IDS_ARRAY",
    "array.required": "COLOR_IDS_REQUIRED",
    "string.base": "COLOR_NAME_STRING",
    "string.empty": "COLOR_NAME_EMPTY",
    "any.required": "COLOR_NAME_REQUIRED",
  }),
});
