import mongoose from "mongoose";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import ProductModel, { ProductImage } from "./models/product.model";
import {
  IProductDto,
  IProductResponseDto,
  ISizeQuantityDto,
  IUpdateProductDto,
} from "./product.dto";
import SizeQuantityModel from "./models/sizeQuantity.model";
import HttpStatus from "../../utils/http-status.utils";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import s3 from "../../config/s3.config";
import { DeleteObjectRequest } from "aws-sdk/clients/s3";

dotenv.config();

export interface ProductService {
  createProductService(
    product: IProductDto,
    images: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<IProductResponseDto | null>>;

  updateProductService(
    id: string,
    product: IUpdateProductDto,
    images: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<IProductResponseDto | null>>;
}

export class ProductServiceImpl implements ProductService {
  createProductService(
    product: IProductDto,
    images: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<IProductResponseDto | null>> {
    return tryCatchService(
      async () => {
        const data = { ...product };

        const bucketName = process.env.AWS_NAME!;
        const uploadPromises = images.map(async (file) => {
          const resizedBuffer = await sharp(file.buffer)
            .resize({ width: 800 })
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
            id: key,
            url: uploadResult.Location,
          };
        });

        const imageUrls = await Promise.all(uploadPromises);

        const newProduct = await ProductModel.create({
          ...data,
          images: imageUrls,
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
        await newProduct.save();

        return apiResponse(
          HttpStatus.OK,
          __("PRODUCT_CREATED_SUCCESSFULLY"),
          newProduct
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
    images: Express.Multer.File[],
    sizeQuantity: ISizeQuantityDto[],
    __: TranslateFunction
  ): Promise<APIResponse<IProductResponseDto | null>> {
    return tryCatchService(
      async () => {
        const existingProduct = await ProductModel.findById(id);
        const bucketName = process.env.AWS_NAME!;

        if (!existingProduct) {
          return apiError(HttpStatus.NOT_FOUND, __("PRODUCT_NOT_FOUND"));
        }

        existingProduct.name = product.name ?? existingProduct.name;
        existingProduct.description =
          product.description ?? existingProduct.description;
        existingProduct.price = product.price ?? existingProduct.price;
        existingProduct.category = product.category ?? existingProduct.category;
        existingProduct.brand = product.brand ?? existingProduct.brand;
        existingProduct.isActive = product.isActive ?? existingProduct.isActive;
        existingProduct.gender = product.gender ?? existingProduct.gender;
        existingProduct.shoeCollarType =
          product.shoeCollarType ?? existingProduct.shoeCollarType;
        existingProduct.material = product.material ?? existingProduct.material;
        existingProduct.closure = product.closure ?? existingProduct.closure;
        existingProduct.color = product.color ?? existingProduct.color;

        const ids =
          (product.images as ProductImage[] | undefined)?.map(
            (img) => img.id
          ) || [];
        const listImage = (existingProduct.images as ProductImage[]).filter(
          (img) => ids.includes(img.id)
        );

        const toDelete = (existingProduct.images as ProductImage[]).filter(
          (img) => !ids.includes(img.id)
        );
        await Promise.all(
          toDelete.map((img) => {
            const params: DeleteObjectRequest = {
              Bucket: bucketName,
              Key: img.id,
            };
            return s3.deleteObject(params).promise();
          })
        );

        const newUploads = await Promise.all(
          images.map(async (file) => {
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
              id: newKey,
            };
          })
        );

        existingProduct.images = [...listImage, ...newUploads];

        const existingSizeQuantities = await SizeQuantityModel.find({
          productId: existingProduct._id,
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
                productId: existingProduct._id,
              });
              return created._id;
            }
          })
        );

        existingProduct.sizes = newSizeQuantityIds;

        await existingProduct.save();

        return apiResponse(
          HttpStatus.OK,
          __("PRODUCT_UPDATED_SUCCESSFULLY"),
          existingProduct
        );
      },
      "INTERNAL_SERVER_ERROR",
      "updateProductService",
      __
    );
  }
}
