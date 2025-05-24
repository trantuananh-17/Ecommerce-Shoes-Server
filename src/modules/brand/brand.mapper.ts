import { IBrandNameResponseDto, IBrandResponseDto } from "./brand.dto";
import { IBrand } from "./brand.model";

export const brandResponseMapper = (brand: IBrand): IBrandResponseDto => {
  return {
    id: brand._id.toString(),
    name: brand.name,
    country: brand.country,
    websiteUrl: brand.websiteUrl,
    isActive: brand.isActive,
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString(),
  };
};

export const brandNameResponseMapper = (
  brand: IBrand
): IBrandNameResponseDto => {
  return {
    id: brand._id.toString(),
    name: brand.name,
  };
};
