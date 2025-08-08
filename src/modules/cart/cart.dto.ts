export interface ICreateCartItemDto {
  productId: string;
  sizeId: string;
  quantity: number;
}

export interface IUpdateCartItemDto {
  sizeQuantityId: string;
  quantity: number;
}

export interface ICartItemSumaryDto {
  totalItems: number;
}

export interface ICartItemsDto {
  productId: string;
  sizeQuantityId: string;
  thumbnail: string;
  productName: string;
  slug: string;
  brand: string;
  price: number;
  discountedPrice: number;
  sizeId: string;
  size: string;
  quantity: number;
  stockQuantity: number;
}
