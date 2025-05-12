import { ICreateSizeDto, ISizeResponseDto } from "./size.dto";
import { ISize } from "./size.model";

export const sizeResponseMapper = (size: ISize): ISizeResponseDto => {
  return {
    id: size._id.toString(),
    name: size.name,
    createdAt: size.createdAt.toLocaleString(),
  };
};
