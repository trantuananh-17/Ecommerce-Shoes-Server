import { Document, model, Schema } from "mongoose";
import { Gender } from "../../user/models/user.model";

type productImage = { url: string; id: string };

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
    images: productImage[];
    sizes: {
      size: Schema.Types.ObjectId;
      quantity: number;
    }[];
  }[];
  eventDiscounts: Schema.Types.ObjectId[];
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
            url: String,
            id: String,
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
    eventDiscounts: [{ type: Schema.Types.ObjectId, ref: "EventDiscount" }],
  },
  { timestamps: true }
);

const ProductModel = model("Product", productSchema);
export default ProductModel;
