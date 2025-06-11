import { Product } from "./models/product.model";
import { ICreateProductResponseDto } from "./product.dto";

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
