import { Document, model, Schema } from "mongoose";
import { Gender } from "../../user/models/user.model";

type ProductImage = { url: string; id: string };

export interface Product extends Document {
  name: string;
  brand: Schema.Types.ObjectId;
  price: number;
  description: string;
  warranty: string;
  isActive: boolean;
  gender: Gender;
  category: Schema.Types.ObjectId;
  colors: {
    color: Schema.Types.ObjectId;
    images: ProductImage[];
    sizes: {
      size: Schema.Types.ObjectId;
      quantity: number;
    }[];
  }[];
  eventDiscounts: Schema.Types.ObjectId;
  ratings: Schema.Types.ObjectId[];
  averageRating: number;
}

const productSchema: Schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    warranty: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    gender: { type: String, enum: Object.values(Gender), required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    colors: [
      {
        color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
        images: [
          {
            type: Object,
            url: { type: String, required: true },
            id: { type: String, required: true },
          },
        ],
        sizes: [
          {
            size: { type: Schema.Types.ObjectId, ref: "Size" },
            quantity: { type: Number, required: true, default: 0 },
          },
        ],
      },
    ],
    eventDiscounts: { type: Schema.Types.ObjectId, ref: "EventDiscount" },
    ratings: [{ type: Schema.Types.ObjectId, ref: "ProductRate" }],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductModel = model("Product", productSchema);
export default ProductModel;
