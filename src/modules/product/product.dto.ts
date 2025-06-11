import { Gender } from "../user/models/user.model";
import { ShoeCollarType } from "./product.validate";

export interface IProductDto {
  name: {
    vi: string;
    en: string;
  };
  brand: string;
  price: number;
  description: {
    vi: string;
    en: string;
  };
  gender: Gender;
  shoeCollarType: ShoeCollarType;
  category: string;
  material: string;
  closure: string;
  color: string;
}

export interface ISizeQuantityDto {
  size: string;
  quantity: number;
}

export interface ICreateProductResponseDto {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  slug: {
    vi: string;
    en: string;
  };
  brand: string;
  price: number;
  description: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  gender: string;
  shoeCollarType: string;
  category: string;
  material: string;
  closure: string;
  color: string;
  thumbnail?: string;
  images?: {
    key: string;
    url: string;
  }[];
  sizes: string[];
  ratings: string[];
  averageRating: number;
}

export interface IUpdateProductDto {
  name: {
    vi: string;
    en: string;
  };
  slug: {
    vi: string;
    en: string;
  };
  brand: string;
  price: number;
  description: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  gender: Gender;
  shoeCollarType: ShoeCollarType;
  category: string;
  material: string;
  closure: string;
  color: string;
  thumbnail?: string;
  images?: {
    key: string;
    url: string;
  }[];
  sizes: string[];
}
