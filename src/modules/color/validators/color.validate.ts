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
    "array.base": "COLOR_IDS_ARRAY", // Nếu không phải mảng
    "array.required": "COLOR_IDS_REQUIRED", // Nếu trường mảng không có trong dữ liệu
    "string.base": "COLOR_NAME_STRING", // Nếu các phần tử trong mảng không phải là chuỗi
    "string.empty": "COLOR_NAME_EMPTY", // Nếu phần tử trong mảng là chuỗi rỗng
    "any.required": "COLOR_NAME_REQUIRED", // Nếu không có giá trị nào trong mảng
  }),
});
