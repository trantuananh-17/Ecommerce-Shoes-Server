import { Document, model, Schema, Types } from "mongoose";
import { Gender } from "../../user/models/user.model";

export type ProductImage = { url: string; key: string };

enum ShoeCollarType {
  LowCut = "LowCut",
  MidCut = "MidCut",
  HighCut = "HighCut",
}

export interface Product extends Document {
  _id: Types.ObjectId;
  name: {
    vi: string;
    en: string;
  };
  slug: { vi: string; en: string };
  brand: Schema.Types.ObjectId;
  price: number;
  description: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  gender: Gender;
  shoeCollarType: ShoeCollarType;
  category: Schema.Types.ObjectId;
  material: Schema.Types.ObjectId;
  closure: Schema.Types.ObjectId;
  eventDiscounts: Schema.Types.ObjectId;
  color: Schema.Types.ObjectId;
  thumbnail?: string;
  images?: ProductImage[];
  sizes: Schema.Types.ObjectId[];
  ratings: Schema.Types.ObjectId[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema<Product>(
  {
    name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    slug: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    price: { type: Number, required: true },
    description: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    shoeCollarType: {
      type: String,
      enum: Object.values(ShoeCollarType),
      required: false,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    material: { type: Schema.Types.ObjectId, ref: "Material", required: true },
    closure: { type: Schema.Types.ObjectId, ref: "Closure", required: true },
    eventDiscounts: { type: Schema.Types.ObjectId, ref: "EventDiscount" },
    color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
    thumbnail: { type: String },
    images: {
      type: [
        {
          url: { type: String, required: true },
          key: { type: String, required: true },
        },
      ],
      default: [],
    },
    sizes: [
      { type: Schema.Types.ObjectId, ref: "SizeQuantity", required: true },
    ],
    ratings: [{ type: Schema.Types.ObjectId, ref: "ProductRate" }],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductModel = model<Product>("Product", productSchema);
export default ProductModel;
