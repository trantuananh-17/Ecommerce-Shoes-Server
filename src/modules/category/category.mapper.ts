import {
  ICategoryResponseDto,
  ICreateCategoryResponseDto,
} from "./category.dto";
import { ICategory } from "./category.model";

export const createCategoryResponseMapper = (
  category: ICategory
): ICreateCategoryResponseDto => {
  return {
    id: category._id.toString(),
    name: {
      vi: category.name.vi,
      en: category.name.en,
    },
    slug: {
      vi: category.slug.vi,
      en: category.slug.en,
    },
    isActive: category.isActive,
    createdAt: category.createdAt.toISOString(),
  };
};

export const categoryResponseMapper = (
  category: ICategory,
  lang: string | "vi"
): ICategoryResponseDto => {
  return {
    id: category._id.toString(),
    name: category.name[lang as keyof typeof category.name],
    slug: category.slug[lang as keyof typeof category.slug],
    isActive: category.isActive,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
};
