import { Product } from "./models/product.model";
import {
  ICreateProductResponseDto,
  IProductByIdResponseDto,
  IProductResponseDto,
} from "./product.dto";

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
  return {
    id: product.id || product._id?.toString(),
    name: product.name,
    slug: product.slug,
    price: product.price,
    discountedPrice: product.discountedPrice,
    isDiscounted: product.isDiscounted,
    discountPercentage: product.discountPercentage,
    isInWishlist:
      product.isInWishlist ??
      (product.wishlistInfo && product.wishlistInfo.length > 0),
    thumbnail: product.thumbnail,
    averageRating: product.averageRating ?? 0,
    sizes: product.sizes,
    sizesWithQuantity: product.sizesWithQuantity ?? 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const productDetailResponseMapper = (
  product: any
): IProductResponseDto => {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    color: product.color,
    closure: product.closure,
    material: product.material,
    description: product.description,
    price: product.price,
    discountedPrice: product.discountedPrice,
    isDiscounted: product.isDiscounted,
    discountPercentage: product.discountPercentage,
    isInWishlist:
      product.isInWishlist ??
      (product.wishlistInfo && product.wishlistInfo.length > 0),
    images: product.images,
    thumbnail: product.thumbnail,
    averageRating: product.averageRating,
    sizes: product.sizes,
    sizesWithQuantity: product.sizesWithQuantity,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const productDetailByIdResponseMapper = (
  product: any
): IProductByIdResponseDto => {
  return {
    id: product._id.toString(),
    name: {
      vi: product.name?.vi,
      en: product.name?.en,
    },
    description: {
      vi: product.description?.vi,
      en: product.description?.en,
    },
    price: product.price,
    brand: product.brand
      ? {
          _id: product.brand._id.toString(),
          name: product.brand.name,
          country: product.brand.country,
          websiteUrl: product.brand.websiteUrl,
        }
      : undefined,
    category: product.category
      ? {
          _id: product.category._id.toString(),
          name: {
            vi: product.category.name?.vi,
            en: product.category.name?.en,
          },
        }
      : undefined,
    material: product.material
      ? {
          _id: product.material._id.toString(),
          name: {
            vi: product.material.name?.vi,
            en: product.material.name?.en,
          },
          description: product.material.description && {
            vi: product.material.description?.vi,
            en: product.material.description?.en,
          },
        }
      : undefined,
    closure: product.closure
      ? {
          _id: product.closure._id.toString(),
          name: {
            vi: product.closure.name?.vi,
            en: product.closure.name?.en,
          },
          description: {
            vi: product.description.name?.vi,
            en: product.description.name?.en,
          },
        }
      : undefined,
    color: product.color
      ? {
          _id: product.color._id.toString(),
          name: {
            vi: product.color.name?.vi,
            en: product.color.name?.en,
          },
        }
      : undefined,
    thumbnail: product.thumbnail,
    images: product.images?.map((img: any) => ({
      url: img.url,
      key: img.key,
      _id: img._id?.toString(),
    })),
    sizes: product.sizes?.map((s: any) => ({
      sizeId: s.sizeId.toString(),
      sizeName: s.sizeName,
      quantity: s.quantity,
    })),
    averageRating: product.averageRating ?? 0,
    sizesWithQuantity: product.sizesWithQuantity ?? 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const productAdminResponseMapper = (
  product: any
): IProductResponseDto => {
  return {
    id: product.id || product._id?.toString(),
    name: product.productName,
    brand: product.brandName,
    price: product.price,
    thumbnail: product.thumbnail,
    sizesWithQuantity: product.sizesWithQuantity ?? 0,
    gender: product.gender,
    isActive: product.isActive,
  };
};
