import { Document, model, Schema } from "mongoose";

export interface EventDiscount extends Document {
  name: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  products: Schema.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
}

const eventDiscountSchema: Schema = new Schema<EventDiscount>(
  {
    name: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EventDiscountModel = model("EventDiscount", eventDiscountSchema);
export default EventDiscountModel;
