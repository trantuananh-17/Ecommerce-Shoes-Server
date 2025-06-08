import { model, Schema, Document, Types } from "mongoose";

export interface ISizeQuantity extends Document {
  productId: Types.ObjectId;
  size: Types.ObjectId;
  quantity: number;
}

const sizeQuantitySchema: Schema = new Schema<ISizeQuantity>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

sizeQuantitySchema.index({ productId: 1, size: 1 }, { unique: true });

const SizeQuantityModel = model<ISizeQuantity>(
  "SizeQuantity",
  sizeQuantitySchema
);
export default SizeQuantityModel;
