export interface ISizeResponseDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateSizeDto {
  name: string;
}

export interface ISizeDeleteManyDto {
  ids: string[];
}

export interface ISizeNameDto {
  id: string;
  name: string;
}
