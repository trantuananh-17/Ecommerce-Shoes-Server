import { Schema, Document, Model, model } from "mongoose";

export interface Discount extends Document {
  discountCode: string;
  discountCost?: number;
  discountPercentage?: number;
  quantity: number;
  startTime: Date;
  endTime: Date;
  discountDescription: string;
  isActive: boolean;
  minItems: number;
  minItemsPerBrand: {
    brand: Schema.Types.ObjectId;
    minQuantity: number;
  }[];
}

const discountSchema: Schema = new Schema<Discount>(
  {
    discountCode: { type: String, required: true, unique: true },
    discountCost: { type: Number, required: false },
    discountPercentage: { type: Number, required: false },
    quantity: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    discountDescription: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    minItems: { type: Number, default: 0 },
    minItemsPerBrand: {
      brand: { type: Schema.Types.ObjectId, ref: "Brand" },
      minQuantity: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const DiscountModel = model("Discount", discountSchema);
export default DiscountModel;
