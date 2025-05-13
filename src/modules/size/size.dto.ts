export interface ISizeResponseDto {
  id: string;
  name: string;
  createdAt: String;
}

export interface ICreateSizeDto {
  name: string;
}

export interface ISizeDeleteManyDto {
  ids: string[];
}
