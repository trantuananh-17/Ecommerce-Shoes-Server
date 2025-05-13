export interface IBannedDto {
  word: string;
}

export interface IBannedResponseDto {
  id: string;
  word: {
    vi: string;
    en: string;
  };
  createdAt: string;
}

export interface IBannedWithLangResponseDto {
  id: string;
  word: string;
  createdAt: string;
}
