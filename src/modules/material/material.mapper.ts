import { IMaterialResponseDTO, IMaterialWithLangDTO } from "./material.dto";
import { IMaterial } from "./material.model";

export const materialResponseMapper = (
  material: IMaterial
): IMaterialResponseDTO => {
  return {
    id: material._id.toString(),
    name: {
      vi: material.name.vi,
      en: material.name.en,
    },
    description: {
      vi: material.description.vi,
      en: material.description.en,
    },
    createdAt: material.createdAt.toLocaleString(),
    updatedAt: material.updatedAt.toLocaleString(),
  };
};

export const materialWithLangMapper = (
  material: IMaterial,
  lang: string | "vi"
): IMaterialWithLangDTO => {
  return {
    id: material._id.toString(),
    name: material.name[lang as keyof typeof material.name],
    description:
      material.description[lang as keyof typeof material.description],
    createdAt: material.createdAt.toLocaleString(),
    updatedAt: material.updatedAt.toLocaleString(),
  };
};
