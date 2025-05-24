import { Schema, Document, Model, model, Types } from "mongoose";

export interface IDiscount extends Document {
  _id: Types.ObjectId;
  discountCode: string;
  discountCost?: number;
  discountPercentage?: number;
  quantity: number;
  startTime: Date;
  endTime: Date;
  discountDescription: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  minItems: number;
  minItemsPerBrand?: {
    brand: Schema.Types.ObjectId;
    minQuantity: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const discountSchema: Schema = new Schema<IDiscount>(
  {
    discountCode: { type: String, required: true, unique: true },
    discountCost: { type: Number, required: false },
    discountPercentage: { type: Number, required: false },
    quantity: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    discountDescription: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
    minItems: { type: Number, default: 1, min: 1 },
    minItemsPerBrand: {
      brand: { type: Schema.Types.ObjectId, ref: "Brand" },
      minQuantity: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);

const DiscountModel = model<IDiscount>("Discount", discountSchema);
export default DiscountModel;
