export interface IBannedDto {
  word: { vi: string; en: string };
}

export interface IBannedResponseDto {
  id: string;
  word: {
    vi: string;
    en: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IBannedWithLangResponseDto {
  id: string;
  word: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBannedWordDeleteManyDto {
  ids: string[];
}
