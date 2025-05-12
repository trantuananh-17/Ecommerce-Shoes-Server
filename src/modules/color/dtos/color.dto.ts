export interface ICreateColorDto {
  name: string;
}

export interface IColorResponseDto {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IColorWithLangResponseDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
