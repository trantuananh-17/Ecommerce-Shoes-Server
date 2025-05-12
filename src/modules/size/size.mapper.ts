import { SizeResponseDto } from "./size.dto";

export const sizeResponseMapper = (size: any): SizeResponseDto => {
  return {
    id: size._id.toString(),
    name: size.name,
    createdAt: size.createdAt.toLocaleString(),
  };
};
