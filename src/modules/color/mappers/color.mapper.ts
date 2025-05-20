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
    isActive: color.isActive,
    createdAt: color.createdAt.toLocaleString(),
    updatedAt: color.updatedAt.toLocaleString(),
  };
};

export const colorWithLangMapper = (
  color: IColor,
  lang: string | "vi"
): IColorWithLangResponseDto => {
  return {
    id: color._id.toString(),
    name: color.name[lang as keyof typeof color.name],
    isActive: color.isActive,
    createdAt: color.createdAt.toLocaleString(),
    updatedAt: color.updatedAt.toLocaleString(),
  };
};
