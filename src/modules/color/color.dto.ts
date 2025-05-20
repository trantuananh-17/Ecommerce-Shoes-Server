export interface ICreateColorDto {
  name: {
    vi: string;
    en: string;
  };
}

export interface IColorResponseDto {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IColorWithLangResponseDto {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IColorUpdateDTO {
  isActive: boolean;
}

export interface IColorDeleteManyDto {
  ids: string[];
}
