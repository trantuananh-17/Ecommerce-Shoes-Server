export interface IBrandDto {
  name: string;
  country: string;
  websiteUrl: string;
}

export interface IBrandResponseDto {
  id: string;
  name: string;
  country: string;
  websiteUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateActiveBrandDto {
  isActive: boolean;
}

export interface IBrandNameResponseDto {
  id: string;
  name: string;
}
