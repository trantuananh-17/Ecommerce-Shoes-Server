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
import { productCreateResponseMapper } from "./product.mapper";
import { Gender } from "aws-sdk/clients/polly";
import { slugify } from "../../utils/helpers/slugify.helper";

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
}

export class ProductServiceImpl implements ProductService {
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
          sizes: [],
          ratings: [],
        });

        console.log(newProduct);

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
}
