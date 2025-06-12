export interface ICreateEventDto {
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
