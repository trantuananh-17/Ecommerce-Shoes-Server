import { IBannedResponseDto, IBannedWithLangResponseDto } from "./banned.dto";
import { IBanned } from "./banned.model";

export const bannedResponseMapper = (banner: IBanned): IBannedResponseDto => {
  return {
    id: banner._id.toString(),
    word: {
      vi: banner.word.vi,
      en: banner.word.en,
    },
    createdAt: banner.createdAt.toISOString(),
  };
};

export const bannedWithLangMapper = (
  banned: IBanned,
  lang: string | "vi"
): IBannedWithLangResponseDto => {
  return {
    id: banned._id.toString(),
    word: banned.word[lang as keyof typeof banned.word],
    createdAt: banned.createdAt.toISOString(),
  };
};
