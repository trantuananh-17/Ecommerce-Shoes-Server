export interface ICreateCategoryDto {
  name: string;
}

export interface ICreateCategoryResponseDto {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  slug: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface ICategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateActiveCategoryDto {
  isActive: boolean;
}

export interface IUpdateCategoryDto {
  name: string;
  isActive: boolean;
}
