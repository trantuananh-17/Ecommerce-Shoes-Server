import mongoose, { Document, model, Schema } from "mongoose";

export interface IOrderItem extends Document {
  orderId: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  productName: { vi: string; en: string };
  slug: { vi: string; en: string };
  quantity: number;
  price: number;
  discountedPrice: number;
  discount?: number;
  totalPrice: number;
  size: string;
  thumbnail: string;
}

const orderItemSchema: Schema = new Schema<IOrderItem>({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
  },
  slug: {
    vi: { type: String, required: true },
    en: { type: String, required: true },
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  size: { type: String, ref: "Size", required: true },
  thumbnail: { type: String, required: true },
});

const OrderItemModel = model<IOrderItem>("OrderItem", orderItemSchema);
export default OrderItemModel;
