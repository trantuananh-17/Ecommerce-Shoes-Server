import Joi from "joi";

export const discountSchema = Joi.object({
  discountCode: Joi.string().trim().required().messages({
    "string.base": "DISCOUNT_CODE_STRING",
    "string.empty": "DISCOUNT_CODE_EMPTY",
    "any.required": "DISCOUNT_CODE_REQUIRED",
  }),

  discountCost: Joi.number().min(0).optional().messages({
    "number.base": "DISCOUNT_COST_NUMBER",
    "number.min": "DISCOUNT_COST_MIN",
  }),

  discountPercentage: Joi.number().min(0).max(100).optional().messages({
    "number.base": "DISCOUNT_PERCENTAGE_NUMBER",
    "number.min": "DISCOUNT_PERCENTAGE_MIN",
    "number.max": "DISCOUNT_PERCENTAGE_MAX",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "QUANTITY_NUMBER",
    "number.integer": "QUANTITY_INTEGER",
    "number.min": "QUANTITY_MIN",
    "any.required": "QUANTITY_REQUIRED",
  }),

  startTime: Joi.date().required().messages({
    "date.base": "START_TIME_DATE",
    "any.required": "START_TIME_REQUIRED",
  }),

  endTime: Joi.date().greater(Joi.ref("startTime")).required().messages({
    "date.base": "END_TIME_DATE",
    "date.greater": "END_TIME_AFTER_START",
    "any.required": "END_TIME_REQUIRED",
  }),

  discountDescription: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.base": "DESCRIPTION_VI_STRING",
      "string.empty": "DESCRIPTION_VI_EMPTY",
      "any.required": "DESCRIPTION_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.base": "DESCRIPTION_EN_STRING",
      "string.empty": "DESCRIPTION_EN_EMPTY",
      "any.required": "DESCRIPTION_EN_REQUIRED",
    }),
  })
    .required()
    .messages({
      "object.base": "DESCRIPTION_OBJECT",
      "any.required": "DESCRIPTION_REQUIRED",
    }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "IS_ACTIVE_BOOLEAN",
  }),

  minItems: Joi.number().integer().min(1).default(1).messages({
    "number.base": "MIN_ITEMS_NUMBER",
    "number.integer": "MIN_ITEMS_INTEGER",
    "number.min": "MIN_ITEMS_MIN",
  }),
  minItemsPerBrand: Joi.object({
    brand: Joi.string().required().messages({
      "string.base": "BRAND_STRING",
      "any.required": "BRAND_REQUIRED",
    }),
    minQuantity: Joi.number().integer().min(0).default(0).messages({
      "number.base": "MIN_QUANTITY_NUMBER",
      "number.integer": "MIN_QUANTITY_INTEGER",
      "number.min": "MIN_QUANTITY_MIN",
    }),
  })
    .optional()
    .messages({
      "object.base": "MIN_ITEMS_PER_BRAND_OBJECT",
    }),
});

export const discountActiveSchema = Joi.object({
  isActive: Joi.boolean().required().empty().messages({
    "boolean.base": "IS_ACTIVE_BOOLEAN",
    "boolean.empty": "BRAND_ACTIVE_EMPTY",
    "any.required": "BRAND_ACTIVE_REQUIRED",
  }),
});
