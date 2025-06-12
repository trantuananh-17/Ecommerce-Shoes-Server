import { Product } from "./models/product.model";
import { ICreateProductResponseDto, IProductResponseDto } from "./product.dto";

export const productCreateResponseMapper = (
  product: Product
): ICreateProductResponseDto => {
  return {
    id: product._id.toString(),
    name: {
      vi: product.name.vi,
      en: product.name.en,
    },
    slug: {
      vi: product.slug.vi,
      en: product.slug.en,
    },
    brand: product.brand.toString(),
    price: product.price,
    description: {
      vi: product.name.vi,
      en: product.name.en,
    },
    isActive: product.isActive,
    gender: product.gender.toString(),
    shoeCollarType: product.shoeCollarType.toString(),
    category: product.category.toString(),
    material: product.material.toString(),
    closure: product.closure.toString(),
    color: product.color.toString(),
    thumbnail: product.thumbnail,
    images: product.images?.map((img) => ({
      key: img.key,
      url: img.url,
    })),
    sizes: product.sizes.map((size) => size.toString()),
    ratings: product.ratings.map((rating) => rating.toString()),
    averageRating: product.averageRating,
  };
};

export const productResponseMapper = (product: any): IProductResponseDto => {
  const event = product.matchedEvents?.[0];
  const hasDiscount = !!event;

  const discountPercentage = event?.discountPercentage ?? 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - discountPercentage / 100))
    : product.price;

  const isInWishlist = product.wishlistInfo && product.wishlistInfo.length > 0;

  return {
    id: product._id.toString(),
    name: product.name,
    price: product.price,
    discountedPrice,
    isDiscounted: hasDiscount,
    discountPercentage: hasDiscount ? discountPercentage : undefined,
    isInWishlist,

    thumbnail: product.thumbnail,
    averageRating: product.averageRating,

    // Trả về tổng số lượng từ tất cả các kích thước
    sizes: product.sizes,
    sizesWithQuantity: product.sizesWithQuantity,

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
