import Joi from "joi";
import { Gender } from "../user/models/user.model";

export enum ShoeCollarType {
  LowCut = "LowCut",
  MidCut = "MidCut",
  HighCut = "HighCut",
}

export const productCreateValidate = Joi.object({
  name: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "DESCRIPTION_VI_EMPTY",
      "any.required": "DESCRIPTION_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "DESCRIPTION_EN_EMPTY",
      "any.required": "DESCRIPTION_EN_REQUIRED",
    }),
  })
    .required()
    .messages({
      "object.base": "DESCRIPTION_MUST_BE_OBJECT",
      "any.required": "DESCRIPTION_REQUIRED",
    }),

  brand: Joi.string().required().messages({
    "string.empty": "BRAND_REQUIRED",
    "string.pattern.base": "BRAND_INVALID_ID",
  }),

  price: Joi.number().required().positive().messages({
    "number.base": "PRICE_MUST_BE_NUMBER",
    "any.required": "PRICE_REQUIRED",
    "number.positive": "PRICE_MUST_BE_POSITIVE",
  }),

  description: Joi.object({
    vi: Joi.string().trim().required().messages({
      "string.empty": "DESCRIPTION_VI_EMPTY",
      "any.required": "DESCRIPTION_VI_REQUIRED",
    }),
    en: Joi.string().trim().required().messages({
      "string.empty": "DESCRIPTION_EN_EMPTY",
      "any.required": "DESCRIPTION_EN_REQUIRED",
    }),
  })
    .required()
    .messages({
      "object.base": "DESCRIPTION_MUST_BE_OBJECT",
      "any.required": "DESCRIPTION_REQUIRED",
    }),

  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required()
    .messages({
      "any.only": "GENDER_INVALID",
      "any.required": "GENDER_REQUIRED",
    }),

  shoeCollarType: Joi.string()
    .valid(...Object.values(ShoeCollarType))
    .optional()
    .messages({
      "any.only": "SHOE_COLLAR_TYPE_INVALID",
    }),

  category: Joi.string().required().messages({
    "string.empty": "CATEGORY_REQUIRED",
    "string.pattern.base": "CATEGORY_INVALID_ID",
  }),

  material: Joi.string().required().messages({
    "string.empty": "MATERIAL_REQUIRED",
    "string.pattern.base": "MATERIAL_INVALID_ID",
  }),

  closure: Joi.string().required().messages({
    "string.empty": "CLOSURE_REQUIRED",
    "string.pattern.base": "CLOSURE_INVALID_ID",
  }),

  eventDiscounts: Joi.string().optional().messages({
    "string.pattern.base": "EVENT_DISCOUNT_INVALID_ID",
  }),

  color: Joi.string().required().messages({
    "string.empty": "COLOR_REQUIRED",
    "string.pattern.base": "COLOR_INVALID_ID",
  }),

  sizes: Joi.array()
    .items(Joi.string().messages({ "string.pattern.base": "SIZE_ID_INVALID" }))
    .default([])
    .messages({
      "array.base": "SIZES_MUST_BE_ARRAY",
    }),

  ratings: Joi.array()
    .items(
      Joi.string().messages({
        "string.pattern.base": "RATING_ID_INVALID",
      })
    )
    .optional(),

  averageRating: Joi.number().optional().min(0).max(5).messages({
    "number.base": "AVERAGE_RATING_MUST_BE_NUMBER",
    "number.min": "AVERAGE_RATING_MIN_0",
    "number.max": "AVERAGE_RATING_MAX_5",
  }),
});

const sizeQuantitySchema = Joi.object({
  size: Joi.string().required().messages({
    "any.required": "SIZE_ID_REQUIRED",
    "string.pattern.base": "SIZE_ID_INVALID",
  }),
  quantity: Joi.number().required().integer().min(0).messages({
    "any.required": "QUANTITY_REQUIRED",
    "number.base": "QUANTITY_MUST_BE_NUMBER",
    "number.min": "QUANTITY_MIN_0",
  }),
});

export const sizeQuantityArraySchema = Joi.array()
  .items(sizeQuantitySchema)
  .min(1)
  .required()
  .messages({
    "array.base": "SIZE_QUANTITY_MUST_BE_ARRAY",
    "array.min": "AT_LEAST_ONE_SIZE_REQUIRED",
    "any.required": "SIZE_QUANTITY_REQUIRED",
  });

export const productUpdateValidate = Joi.object({
  name: Joi.object({
    vi: Joi.string().trim().optional(),
    en: Joi.string().trim().optional(),
  })
    .optional()
    .messages({
      "object.base": "NAME_MUST_BE_OBJECT",
    }),

  brand: Joi.string().optional().messages({
    "string.pattern.base": "BRAND_INVALID_ID",
  }),

  price: Joi.number().positive().optional().messages({
    "number.base": "PRICE_MUST_BE_NUMBER",
    "number.positive": "PRICE_MUST_BE_POSITIVE",
  }),

  description: Joi.object({
    vi: Joi.string().trim().optional(),
    en: Joi.string().trim().optional(),
  })
    .optional()
    .messages({
      "object.base": "DESCRIPTION_MUST_BE_OBJECT",
    }),

  isActive: Joi.boolean().optional(),

  gender: Joi.string()
    .valid(...Object.values(Gender))
    .optional()
    .messages({
      "any.only": "GENDER_INVALID",
    }),

  shoeCollarType: Joi.string()
    .valid(...Object.values(ShoeCollarType))
    .optional()
    .messages({
      "any.only": "SHOE_COLLAR_TYPE_INVALID",
    }),

  category: Joi.string().optional().messages({
    "string.pattern.base": "CATEGORY_INVALID_ID",
  }),

  material: Joi.string().optional().messages({
    "string.pattern.base": "MATERIAL_INVALID_ID",
  }),

  closure: Joi.string().optional().messages({
    "string.pattern.base": "CLOSURE_INVALID_ID",
  }),

  color: Joi.string().optional().messages({
    "string.pattern.base": "COLOR_INVALID_ID",
  }),

  images: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        url: Joi.string().uri().required(),
      }).messages({
        "any.required": "IMAGE_FIELD_REQUIRED",
        "string.uri": "IMAGE_URL_INVALID",
      })
    )
    .optional()
    .messages({
      "array.base": "IMAGES_MUST_BE_ARRAY",
    }),

  sizes: Joi.array()
    .items(Joi.string().messages({ "string.pattern.base": "SIZE_ID_INVALID" }))
    .optional()
    .messages({
      "array.base": "SIZES_MUST_BE_ARRAY",
    }),
});
