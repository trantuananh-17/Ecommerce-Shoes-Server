import { Document, model, Schema } from "mongoose";

export interface OrderItem extends Document {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  discount?: number;
  totalPrice: number;
  size: Schema.Types.ObjectId;
  color: Schema.Types.ObjectId;
}

const orderItemSchema: Schema = new Schema<OrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  size: { type: Schema.Types.ObjectId, ref: "Size", required: true },
  color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
});

const OrderItemModel = model("OrderItem", orderItemSchema);
export default OrderItemModel;
