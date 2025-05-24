import { Types } from "mongoose";

export interface IDiscountDto {
  discountCode: string;
  discountCost?: number;
  discountPercentage?: number;
  quantity: number;
  startTime: Date;
  endTime: Date;
  discountDescription: {
    vi: string;
    en: string;
  };
  isActive?: boolean;
  minItems?: number;
  minItemsPerBrand?: {
    brand: Types.ObjectId | string;
    minQuantity?: number;
  };
}

export interface IDiscountCreateResponseDto {
  id: string;
  discountCode: string;
  discountCost?: number;
  discountPercentage?: number;
  quantity: number;
  startTime: Date;
  endTime: Date;
  discountDescription: {
    vi: string;
    en: string;
  };
  isActive?: boolean;
  minItems?: number;
  minItemsPerBrand?: {
    brand: string;
    minQuantity?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IDiscountInfoResponseDto {
  id: string;
  discountCode: string;
  discountCost?: number;
  discountPercentage?: number;
  quantity: number;
  startTime: Date;
  endTime: Date;
  discountDescription: string;
  isActive?: boolean;
  minItems?: number;
  minItemsPerBrand?: {
    brand: string;
    minQuantity?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IDiscountResponseDto {
  id: string;
  discountCode: string;
  discountCost?: number;
  discountPercentage?: number;
  quantity: number;
  startTime: Date;
  endTime: Date;
  discountDescription: string;
  isActive?: boolean;
  minItems?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IDiscountActiveDto {
  isActive?: boolean;
}
