export interface IMaterialDTO {
  name: { vi: string; en: string };
  description: { vi: string; en: string };
}

export interface IMaterialResponseDTO {
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

export interface IMaterialWithLangDTO {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
