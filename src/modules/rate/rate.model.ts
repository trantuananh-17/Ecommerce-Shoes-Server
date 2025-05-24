import { Document, model, Schema } from "mongoose";

type ProductImage = { url: string; id: string };

export interface ProductRate extends Document {
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  rate: number;
  content: string;
  reviewStatus: boolean;
  images: ProductImage[];
}

const productRateSchema: Schema = new Schema<ProductRate>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    reviewStatus: { type: Boolean, default: false },
    images: [
      {
        type: Object,
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const ProductRateModel = model("ProductRate", productRateSchema);
export default ProductRateModel;
