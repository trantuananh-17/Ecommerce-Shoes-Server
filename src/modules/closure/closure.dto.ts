export interface IClosureDTO {
  name: { vi: string; en: string };
  description: { vi: string; en: string };
}

export interface IClosureResponseDTO {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IClosureWithLangDTO {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
