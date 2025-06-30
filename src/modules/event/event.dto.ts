export interface IEventDto {
  name: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  products: string[];
  isActive: boolean;
}

export interface ICreateEventResponseDto {
  id: string;
  name: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  products: string[];
  isActive: boolean;
}

export interface IUpdateActiveDto {
  isActive: boolean;
}
export interface IEventResponseDto {
  id: string;
  name: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  numberOfProducts: number;
  isActive: boolean;
}
