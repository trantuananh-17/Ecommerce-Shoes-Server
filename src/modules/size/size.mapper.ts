import { ICreateSizeDto, ISizeNameDto, ISizeResponseDto } from "./size.dto";
import { ISize } from "./size.model";

export const sizeResponseMapper = (size: ISize): ISizeResponseDto => {
  return {
    id: size._id.toString(),
    name: size.name,
    createdAt: size.createdAt.toISOString(),
    updatedAt: size.updatedAt.toISOString(),
  };
};

export const sizeNameResponseMapper = (size: ISize): ISizeNameDto => {
  return {
    id: size._id.toString(),
    name: size.name,
  };
};
