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
    "array.base": "SIZE_IDS_ARRAY", // Nếu không phải mảng
    "array.required": "SIZE_IDS_REQUIRED", // Nếu trường mảng không có trong dữ liệu
    "string.base": "SIZE_NAME_STRING", // Nếu các phần tử trong mảng không phải là chuỗi
    "string.empty": "SIZE_NAME_EMPTY", // Nếu phần tử trong mảng là chuỗi rỗng
    "any.required": "SIZE_NAME_REQUIRED", // Nếu không có giá trị nào trong mảng
  }),
});
