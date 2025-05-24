import { IClosureResponseDTO, IClosureWithLangDTO } from "./closure.dto";
import { IClosure } from "./closure.model";

export const closureResponseMapper = (
  closure: IClosure
): IClosureResponseDTO => {
  return {
    id: closure._id.toString(),
    name: {
      vi: closure.name.vi,
      en: closure.name.en,
    },
    description: {
      vi: closure.description.vi,
      en: closure.description.en,
    },
    createdAt: closure.createdAt.toISOString(),
    updatedAt: closure.updatedAt.toISOString(),
  };
};

export const closureWithLangMapper = (
  closure: IClosure,
  lang: string | "vi"
): IClosureWithLangDTO => {
  return {
    id: closure._id.toString(),
    name: closure.name[lang as keyof typeof closure.name],
    description: closure.description[lang as keyof typeof closure.description],
    createdAt: closure.createdAt.toISOString(),
    updatedAt: closure.updatedAt.toISOString(),
  };
};
