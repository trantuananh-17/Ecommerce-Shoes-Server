import mongoose, { Schema } from "mongoose";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import ProductModel, { ProductImage } from "./models/product.model";
import {
  ICreateProductResponseDto,
  IProductDto,
  IProductResponseDto,
  ISizeQuantityDto,
  IUpdateActiveDto,
  IUpdateProductDto,
} from "./product.dto";
import SizeQuantityModel from "./models/sizeQuantity.model";
import HttpStatus from "../../utils/http-status.utils";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import s3 from "../../config/s3.config";
import { DeleteObjectRequest } from "aws-sdk/clients/s3";
import {
  productCreateResponseMapper,
  productDetailResponseMapper,
  productResponseMapper,
} from "./product.mapper";
import { Gender } from "aws-sdk/clients/polly";
import { slugify } from "../../utils/helpers/slugify.helper";
import UserModel from "../user/models/user.model";
import { discountFields, eventDiscountLookupStage } from "./product.pipeline";

dotenv.config();

export interface ProductService {
  createProductService(
    product: IProductDto,
    images: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<ICreateProductResponseDto | null>>;

  updateProductService(
    id: string,
    product: IUpdateProductDto,
    images: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<ICreateProductResponseDto | null>>;

  updateProductActiveService(
    id: string,
    ProductActive: IUpdateActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>>;

  getProductsService(
    lang: string | "vi",
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean,
    filters?: {
      gender?: string;
      category?: string;
      brand?: string;
      material?: string;
      color?: string;
      closure?: string;
      searchText?: string;
      sortBy?: string;
    },
    userId?: string
  ): Promise<
    APIResponse<{
      data: IProductResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  >;

  getDetailProductBySlugServie(
    lang: string | "vi",
    slug: string,
    __: TranslateFunction,
    userId?: string
  ): Promise<APIResponse<IProductResponseDto | null>>;
}

export class ProductServiceImpl implements ProductService {
  getDetailProductBySlugServie(
    lang: string | "vi",
    slug: string,
    __: TranslateFunction,
    userId?: string
  ): Promise<APIResponse<IProductResponseDto | null>> {
    return tryCatchService(
      async () => {
        const now = new Date();
        const pipeline: any[] = [
          {
            $match: {
              $or: [{ [`slug.${lang}`]: slug }, { [`slug.en`]: slug }],
            },
          },
          eventDiscountLookupStage(now),
          {
            $addFields: {
              ...discountFields(lang),
            },
          },

          ...(userId
            ? [
                {
                  $lookup: {
                    from: "wishlists",
                    localField: "_id",
                    foreignField: "productId",
                    as: "wishlistInfo",
                  },
                },
                {
                  $addFields: {
                    isInWishlist: {
                      $gt: [{ $size: "$wishlistInfo" }, 0],
                    },
                  },
                },
              ]
            : []),

          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryInfo",
            },
          },
          { $unwind: "$categoryInfo" },

          {
            $lookup: {
              from: "colors",
              localField: "color",
              foreignField: "_id",
              as: "colorInfo",
            },
          },
          { $unwind: "$colorInfo" },

          {
            $lookup: {
              from: "closures",
              localField: "closure",
              foreignField: "_id",
              as: "closureInfo",
            },
          },
          { $unwind: "$closureInfo" },

          {
            $lookup: {
              from: "materials",
              localField: "material",
              foreignField: "_id",
              as: "materialInfo",
            },
          },
          { $unwind: "$materialInfo" },

          {
            $lookup: {
              from: "brands",
              localField: "brand",
              foreignField: "_id",
              as: "brandInfo",
            },
          },
          { $unwind: "$brandInfo" },

          // Join sizeQuantities
          {
            $lookup: {
              from: "sizequantities",
              localField: "sizes",
              foreignField: "_id",
              as: "sizeQuantities",
            },
          },
          { $unwind: "$sizeQuantities" },

          // Join sizes
          {
            $lookup: {
              from: "sizes",
              localField: "sizeQuantities.size",
              foreignField: "_id",
              as: "sizeInfo",
            },
          },
          { $unwind: "$sizeInfo" },

          // Group lại để gom sizes
          {
            $group: {
              _id: "$_id",
              doc: { $first: "$$ROOT" },
              sizes: {
                $push: {
                  sizeId: "$sizeInfo._id",
                  sizeName: "$sizeInfo.name",
                  quantity: "$sizeQuantities.quantity",
                },
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: ["$doc", { sizes: "$sizes" }],
              },
            },
          },

          // Final projected fields (optional - include only needed fields)
          {
            $project: {
              _id: 1,
              name: 1,
              slug: 1,
              description: 1,
              price: 1,
              sizes: 1,
              isInWishlist: 1,
              category: {
                $ifNull: [
                  { $getField: { field: lang, input: "$categoryInfo.name" } },
                  "$categoryInfo.name.en",
                ],
              },
              color: {
                $ifNull: [
                  { $getField: { field: lang, input: "$colorInfo.name" } },
                  "$colorInfo.name.en",
                ],
              },
              brand: {
                name: "$brandInfo.name",
                country: "$brandInfo.country",
                websiteUrl: "$brandInfo.websiteUrl",
              },
              material: {
                name: {
                  $ifNull: [
                    { $getField: { field: lang, input: "$materialInfo.name" } },
                    "$materialInfo.name.en",
                  ],
                },
                description: {
                  $ifNull: [
                    {
                      $getField: {
                        field: lang,
                        input: "$materialInfo.description",
                      },
                    },
                    "$materialInfo.description.en",
                  ],
                },
              },
              closure: {
                name: "$closureInfo.name",
                country: "$closureInfo.country",
                websiteUrl: "$closureInfo.websiteUrl",
              },
              discount: 1,
              discountPercent: 1,
              discountEndDate: 1,
            },
          },
        ];

        const [product] = await ProductModel.aggregate(pipeline);

        if (!product) {
          return apiResponse(HttpStatus.NOT_FOUND, __("PRODUCT_NOT_FOUND"));
        }

        console.log(product);

        const productDetail = productDetailResponseMapper(product);

        return apiResponse(
          HttpStatus.OK,
          __("GET_DETAIL_PRODUCT_SUCCESS"),
          productDetail
        );
      },
      "INTERNAL_SERVER_ERROR",
      "getDetailProductBySlugServie",
      __
    );
  }

  getProductsService(
    lang: string = "vi",
    __: TranslateFunction,
    page: number,
    limit: number,
    isActive?: boolean,
    filters?: {
      gender?: string;
      category?: string;
      brand?: string;
      material?: string;
      color?: string;
      closure?: string;
      searchText?: string;
      sortBy?: string;
    },
    userId?: string
  ): Promise<
    APIResponse<{
      data: IProductResponseDto[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    }>
  > {
    return tryCatchService(
      async () => {
        const now = new Date();
        const skip = (page - 1) * limit;

        const sortOptions: Record<string, any> = {
          discountPercentage_desc: { discountPercentage: -1 },
          discountPercentage_asc: { discountPercentage: 1 },
          discounted_price_asc: { discountedPrice: 1 },
          discounted_price_desc: { discountedPrice: -1 },
          price_asc: { price: 1 },
          price_desc: { price: -1 },
          createdAt_desc: { createdAt: -1 },
          createdAt_asc: { createdAt: 1 },
        };

        const matchFilter: any = {};

        // if (typeof isActive === "boolean") matchFilter.isActive = isActive;

        if (userId) {
          const user = await UserModel.findById(userId);
          if (user?.role === "admin") {
            if (typeof isActive === "boolean") matchFilter.isActive = isActive;
          }
        }

        if (filters?.gender) matchFilter.gender = filters.gender;

        const pipeline: any[] = [{ $match: matchFilter }];

        if (filters?.category) {
          pipeline.push({
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryInfo",
            },
          });
          pipeline.push({ $unwind: "$categoryInfo" });
          pipeline.push({
            $match: {
              [`categoryInfo.name.${lang}`]: filters.category,
            },
          });
        }

        if (filters?.brand) {
          pipeline.push({
            $lookup: {
              from: "brands",
              localField: "brand",
              foreignField: "_id",
              as: "brandInfo",
            },
          });
          pipeline.push({ $unwind: "$brandInfo" });
          pipeline.push({
            $match: {
              [`brandInfo.name.${lang}`]: filters.brand,
            },
          });
        }

        if (filters?.searchText) {
          const regex = new RegExp(filters.searchText, "i");
          pipeline.push({
            $match: {
              $or: [
                {
                  [`categoryInfo.name.${lang}`]: { $regex: regex },
                },
                {
                  [`brandInfo.name.${lang}`]: { $regex: regex },
                },
                {
                  [`materialInfo.name.${lang}`]: { $regex: regex },
                },
                {
                  [`colorInfo.name.${lang}`]: { $regex: regex },
                },
                {
                  [`name.${lang}`]: { $regex: regex },
                },
              ],
            },
          });
        }

        if (userId) {
          pipeline.push({
            $lookup: {
              from: "wishlists",
              localField: "_id",
              foreignField: "productId",
              as: "wishlistInfo",
            },
          });

          pipeline.push({
            $addFields: {
              isInWishlist: {
                $gt: [{ $size: "$wishlistInfo" }, 0],
              },
            },
          });
        }

        pipeline.push(eventDiscountLookupStage(now)),
          // Lấy discountPercentage
          pipeline.push({
            $addFields: {
              ...discountFields(lang),
            },
          });

        // Sort

        const sortStage = sortOptions[filters?.sortBy ?? ""] || {
          createdAt: -1,
        };

        pipeline.push({ $sort: sortStage });

        pipeline.push({
          $lookup: {
            from: "sizequantities",
            localField: "sizes",
            foreignField: "_id",
            as: "sizeQuantities",
          },
        });

        pipeline.push({
          $addFields: {
            sizesWithQuantity: {
              $sum: {
                $map: {
                  input: "$sizeQuantities",
                  as: "sizeQty",
                  in: "$$sizeQty.quantity",
                },
              },
            },
          },
        });

        pipeline.push({
          $project: {
            id: "$_id",
            name: 1,
            slug: 1,
            price: 1,
            discountedPrice: 1,
            isDiscounted: 1,
            discountPercentage: 1,
            thumbnail: 1,
            averageRating: 1,
            isInWishlist: 1,
            sizes: 1,
            sizesWithQuantity: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        });

        pipeline.push({
          $facet: {
            paginatedResults: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        });

        const [product] = await ProductModel.aggregate(pipeline);

        console.log(product);

        const products = (product?.paginatedResults ?? []).map(
          productResponseMapper
        );
        const totalDocs = product?.totalCount?.[0]?.count || 0;
        const totalPages = Math.ceil(totalDocs / limit);

        return apiResponse(HttpStatus.OK, __("GET_ALL_DISCOUNT_SUCCESSFULLY"), {
          data: products,
          totalDocs,
          totalPages,
          currentPage: page,
          limit,
        });
      },
      "INTERNAL_SERVER_ERROR",
      "getProductsService",
      __
    );
  }

  createProductService(
    product: IProductDto,
    images: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<ICreateProductResponseDto | null>> {
    return tryCatchService(
      async () => {
        const { name, ...data } = product;

        const bucketName = process.env.AWS_NAME!;
        const uploadPromises = images.map(async (file) => {
          const resizedBuffer = await sharp(file.buffer)
            .resize({
              width: 850,
              height: 1200,
              fit: "cover",
              position: "center",
            })
            .toBuffer();

          const id = uuidv4();
          const key = `uploads/${id}-${file.originalname}`;
          const params = {
            Bucket: bucketName,
            Key: key,
            Body: resizedBuffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          };

          const uploadResult = await s3.upload(params).promise();
          return {
            key: key,
            url: uploadResult.Location,
          };
        });

        const imageUrls = await Promise.all(uploadPromises);

        const slugVi = slugify(name.vi);
        const slugEn = slugify(name.en);

        const newProduct = await ProductModel.create({
          ...data,
          name,
          slug: {
            vi: slugVi,
            en: slugEn,
          },
          images: imageUrls,
          thumbnail: imageUrls[0].url,
          sizes: [],
          ratings: [],
        });

        const sizeQuantityWithProductId = sizeQuantity.map((item) => ({
          ...item,
          productId: newProduct._id,
        }));

        const sizes = await SizeQuantityModel.insertMany(
          sizeQuantityWithProductId
        );
        const sizeQuantityIds = sizes.map((s) => s._id);

        newProduct.sizes = sizeQuantityIds;
        const created = await newProduct.save();
        const response: ICreateProductResponseDto =
          productCreateResponseMapper(created);

        return apiResponse(
          HttpStatus.OK,
          __("PRODUCT_CREATED_SUCCESSFULLY"),
          response
        );
      },
      "INTERNAL_SERVER_ERROR",
      "createProductService",
      __
    );
  }

  updateProductService(
    id: string,
    product: IUpdateProductDto,
    newImages: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<ICreateProductResponseDto | null>> {
    return tryCatchService(
      async () => {
        const bucketName = process.env.AWS_NAME!;

        const {
          name,
          description,
          price,
          brand,
          category,
          closure,
          color,
          gender,
          isActive,
          material,
          shoeCollarType,
          sizes,
          slug,
          images,
          thumbnail,
        } = product;

        const productUpdate = {
          name,
          description,
          price,
          brand,
          category,
          closure,
          color,
          gender,
          isActive,
          material,
          shoeCollarType,
          sizes,
          slug,
          thumbnail,
        };

        const productUpdated = await ProductModel.findByIdAndUpdate(
          id,
          productUpdate,
          {
            new: true,
          }
        );

        if (!productUpdated) {
          return apiError(HttpStatus.NOT_FOUND, __("PRODUCT_NOT_FOUND"));
        }

        console.log(images);

        // Lấy danh sách id trong product
        const ids =
          (images as ProductImage[] | undefined)?.map((img) => img.key) || [];

        console.log(ids);

        // Lấy danh sách ảnh có id này
        const listImage = (productUpdated.images as ProductImage[]).filter(
          (img) => ids.includes(img.key)
        );

        console.log(listImage);

        // Lọc xem id nào bị thiếu để xóa
        const toDelete = (productUpdated.images as ProductImage[]).filter(
          (img) => !ids.includes(img.key)
        );

        console.log(toDelete);

        // Xóa cùng lúc
        await Promise.all(
          toDelete.map((img) => {
            const params: DeleteObjectRequest = {
              Bucket: bucketName,
              Key: img.key,
            };
            return s3.deleteObject(params).promise();
          })
        );

        // Upload ảnh mới(Nếu có).
        const newUploads = await Promise.all(
          newImages.map(async (file) => {
            const resized = await sharp(file.buffer)
              .resize({ width: 800 })
              .toBuffer();
            const newId = uuidv4();
            const newKey = `uploads/${newId}-${file.originalname}`;
            const params = {
              Bucket: bucketName,
              Key: newKey,
              Body: resized,
              ContentType: file.mimetype,
              ACL: "public-read",
            };
            const res = await s3.upload(params).promise();
            return {
              url: res.Location,
              key: newKey,
            };
          })
        );

        productUpdated.images = [...listImage, ...newUploads];

        const existingSizeQuantities = await SizeQuantityModel.find({
          productId: productUpdated._id,
        });
        const existingMap = new Map(
          existingSizeQuantities.map((sq) => [sq.size.toString(), sq])
        );

        const newSizeQuantityIds = await Promise.all(
          sizeQuantity.map(async (item) => {
            const sizeId = item.size.toString();
            const existing = existingMap.get(sizeId);

            if (existing) {
              if (existing.quantity !== item.quantity) {
                existing.quantity = item.quantity;
                await existing.save();
              }
              return existing._id;
            } else {
              const created = await SizeQuantityModel.create({
                ...item,
                productId: productUpdated._id,
              });
              return created._id;
            }
          })
        );

        productUpdated.sizes = newSizeQuantityIds;

        await productUpdated.save();

        return apiResponse(
          HttpStatus.OK,
          __("PRODUCT_UPDATED_SUCCESSFULLY"),
          productUpdated
        );
      },
      "INTERNAL_SERVER_ERROR",
      "updateProductService",
      __
    );
  }

  updateProductActiveService(
    id: string,
    ProductActive: IUpdateActiveDto,
    __: TranslateFunction
  ): Promise<APIResponse<null>> {
    return tryCatchService(
      async () => {
        const { isActive } = ProductActive;

        const existingProduct = await ProductModel.findOne({ id });

        if (existingProduct) {
          return apiError(HttpStatus.NOT_FOUND, __("PRODUCT_NOT_FOUND"));
        }

        const updated = await ProductModel.findByIdAndUpdate(
          id,
          {
            isActive,
          },
          { new: true }
        );

        if (!updated) {
          return apiError(HttpStatus.NOT_FOUND, __("DISCOUNT_NOT_FOUND"));
        }

        return apiResponse(HttpStatus.OK, __("DISCOUNT_UPDATED_SUCCESSFULLY"));
      },
      "INTERNAL_SERVER_ERROR",
      "updateProductActiveService",
      __
    );
  }
}
