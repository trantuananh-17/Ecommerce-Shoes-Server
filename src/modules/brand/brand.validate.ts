import Joi from "joi";

export const brandValidate = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "BRAND_NAME_STRING",
    "string.empty": "BRAND_NAME_EMPTY",
    "any.required": "BRAND_NAME_REQUIRED",
  }),
  country: Joi.string().trim().required().messages({
    "string.base": "BRAND_COUNTRY_STRING",
    "string.empty": "BRAND_COUNTRY_EMPTY",
    "any.required": "BRAND_COUNTRY_REQUIRED",
  }),
  websiteUrl: Joi.string().trim().required().messages({
    "string.base": "BRAND_WEBSITE_STRING",
    "string.empty": "BRAND_WEBSITE_EMPTY",
    "any.required": "BRAND_WEBSITE_REQUIRED",
  }),
});

export const updateBrandActiveValidate = Joi.object({
  isActive: Joi.boolean().required().empty().messages({
    "string.empty": "BRAND_ACTIVE_EMPTY",
    "any.required": "BRAND_ACTIVE_REQUIRED",
  }),
});
