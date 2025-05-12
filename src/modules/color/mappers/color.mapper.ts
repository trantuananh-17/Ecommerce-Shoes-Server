import {
  IColorResponseDto,
  IColorWithLangResponseDto,
} from "../dtos/color.dto";
import { IColor } from "../models/color.model";

export const colorResponseMapper = (color: IColor): IColorResponseDto => {
  return {
    id: color._id.toString(),
    name: {
      vi: color.name.vi,
      en: color.name.en,
    },
    createdAt: color.createdAt.toISOString(),
    updatedAt: color.updatedAt.toISOString(),
  };
};

export const colorWithLangMapper = (
  color: IColor,
  lang: string | "vi"
): IColorWithLangResponseDto => {
  return {
    id: color._id.toString(),
    name: color.name[lang as keyof typeof color.name],
    createdAt: color.createdAt.toISOString(),
    updatedAt: color.updatedAt.toISOString(),
  };
};
