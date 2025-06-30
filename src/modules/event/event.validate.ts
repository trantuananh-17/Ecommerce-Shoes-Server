import Joi from "joi";

export const eventSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "EVENT_NAME_STRING",
    "string.empty": "EVENT_NAME_EMPTY",
    "any.required": "EVENT_NAME_REQUIRED",
  }),

  discountPercentage: Joi.number().min(0).max(100).required().messages({
    "number.base": "DISCOUNT_PERCENTAGE_NUMBER",
    "number.min": "DISCOUNT_PERCENTAGE_MIN",
    "number.max": "DISCOUNT_PERCENTAGE_MAX",
    "any.required": "DISCOUNT_PERCENTAGE_REQUIRED",
  }),

  startDate: Joi.date().required().messages({
    "date.base": "START_DATE_DATE",
    "any.required": "START_DATE_REQUIRED",
  }),

  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.base": "END_DATE_DATE",
    "date.greater": "END_DATE_AFTER_START",
    "any.required": "END_DATE_REQUIRED",
  }),

  products: Joi.array().items(Joi.string()).required().messages({
    "array.base": "PRODUCTS_ARRAY",
    "any.required": "PRODUCTS_REQUIRED",
  }),
});

export const updateEventActiveValidate = Joi.object({
  isActive: Joi.boolean().required().empty().messages({
    "string.empty": "EVENT_ACTIVE_EMPTY",
    "any.required": "EVENT_ACTIVE_REQUIRED",
  }),
});
