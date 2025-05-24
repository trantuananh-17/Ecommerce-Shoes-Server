import {
  IDiscountCreateResponseDto,
  IDiscountInfoResponseDto,
} from "./discount.dto";
import { IDiscount } from "./discount.model";

export const discountCreateResponseMapper = (
  discount: IDiscount
): IDiscountCreateResponseDto => {
  return {
    id: discount._id.toString(),
    discountCode: discount.discountCode,
    discountCost: discount.discountCost,
    discountPercentage: discount.discountPercentage,
    quantity: discount.quantity,
    startTime: discount.startTime,
    endTime: discount.endTime,
    discountDescription: {
      vi: discount.discountDescription.vi,
      en: discount.discountDescription.en,
    },
    isActive: discount.isActive,
    minItems: discount.minItems,
    minItemsPerBrand: discount.minItemsPerBrand
      ? {
          brand: discount.minItemsPerBrand.brand.toString(),
          minQuantity: discount.minItemsPerBrand.minQuantity,
        }
      : undefined,

    createdAt: discount.createdAt.toLocaleString(),
    updatedAt: discount.updatedAt.toLocaleString(),
  };
};

export const discountInfoResponseMapper = (
  discount: IDiscount,
  lang: string | "vi"
): IDiscountInfoResponseDto => {
  return {
    id: discount._id.toString(),
    discountCode: discount.discountCode,
    discountCost: discount.discountCost,
    discountPercentage: discount.discountPercentage,
    quantity: discount.quantity,
    startTime: discount.startTime,
    endTime: discount.endTime,
    discountDescription:
      discount.discountDescription[
        lang as keyof typeof discount.discountDescription
      ],
    isActive: discount.isActive,
    minItems: discount.minItems,
    minItemsPerBrand: discount.minItemsPerBrand
      ? {
          brand: discount.minItemsPerBrand.brand.toString(),
          minQuantity: discount.minItemsPerBrand.minQuantity,
        }
      : undefined,

    createdAt: discount.createdAt.toLocaleString(),
    updatedAt: discount.updatedAt.toLocaleString(),
  };
};

export const discountResponseMapper = (
  discount: IDiscount,
  lang: string | "vi"
): IDiscountInfoResponseDto => {
  return {
    id: discount._id.toString(),
    discountCode: discount.discountCode,
    discountCost: discount.discountCost,
    discountPercentage: discount.discountPercentage,
    quantity: discount.quantity,
    startTime: discount.startTime,
    endTime: discount.endTime,
    discountDescription:
      discount.discountDescription[
        lang as keyof typeof discount.discountDescription
      ],
    isActive: discount.isActive,
    minItems: discount.minItems,
    createdAt: discount.createdAt.toLocaleString(),
    updatedAt: discount.updatedAt.toLocaleString(),
  };
};
