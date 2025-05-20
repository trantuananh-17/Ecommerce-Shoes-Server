import { IBannedResponseDto, IBannedWithLangResponseDto } from "./banned.dto";
import { IBanned } from "./banned.model";

export const bannedResponseMapper = (banned: IBanned): IBannedResponseDto => {
  return {
    id: banned._id.toString(),
    word: {
      vi: banned.word.vi,
      en: banned.word.en,
    },
    createdAt: banned.createdAt.toLocaleString(),
    updatedAt: banned.updatedAt.toLocaleString(),
  };
};

export const bannedWithLangMapper = (
  banned: IBanned,
  lang: string | "vi"
): IBannedWithLangResponseDto => {
  return {
    id: banned._id.toString(),
    word: banned.word[lang as keyof typeof banned.word],
    createdAt: banned.createdAt.toLocaleString(),
    updatedAt: banned.updatedAt.toLocaleString(),
  };
};
