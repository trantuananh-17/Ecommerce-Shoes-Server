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

export interface ICatogoryResponseDto {
  id: string;
  name: string;
  slug: string;
}
