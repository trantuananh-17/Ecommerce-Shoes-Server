import { ICartItemsDto } from "./cart.dto";

export const cartResponseMapper = (
  cartItem: any,
  quantity: number
): ICartItemsDto => {
  return {
    productId: cartItem.productId.toString(),
    sizeQuantityId: cartItem._id.toString(),
    thumbnail: cartItem.thumbnail,
    productName: cartItem.productName,
    slug: cartItem.slug,
    price: cartItem.price,
    discountedPrice: cartItem.discountedPrice,
    sizeId: cartItem.sizeId.toString(),
    size: cartItem.size,
    quantity: quantity,
    stockQuantity: cartItem.stockQuantity,
  };
};
