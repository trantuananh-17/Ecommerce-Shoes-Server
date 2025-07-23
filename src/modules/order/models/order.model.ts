import mongoose, { Document, model, Schema } from "mongoose";

export enum PaymentStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
}

export enum OrderStatus {
  Pending = "Pending",
  Shipped = "Shipping",
  Delivered = "Delivered",
  Canceled = "Canceled",
  Returned = "Returned",
}

export enum PaymentType {
  COD = "COD",
  VNPAY = "VNPAY",
}

export interface IOrder extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  discounts: mongoose.Schema.Types.ObjectId;
  orderNote?: string;
  orderStatus: OrderStatus;
  orderItemsPrices: number;
  orderTotalPrices: number;
  toName: string;
  toPhone: string;
  toEmail: string;
  toProvince: string;
  toDistrict: string;
  toWard: string;
  toAddress: string;
  datePayment: Date;
  dateReceive: Date;
  createdAt: Date;
}

const orderSchema: Schema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentType: {
      type: String,
      enum: Object.values(PaymentType),
      default: PaymentType.COD,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Unpaid,
    },
    discounts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
      required: false,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
    },
    orderNote: { type: String },
    orderItemsPrices: { type: Number, required: true },
    orderTotalPrices: { type: Number, required: true },
    toName: { type: String, required: true },
    toPhone: { type: String, required: true },
    toEmail: { type: String, required: true },
    toWard: { type: String, required: true },
    toAddress: { type: String, required: true },
    toDistrict: { type: String, required: true },
    toProvince: { type: String, required: true },
    datePayment: { type: Date, required: false },
    dateReceive: { type: Date, required: false },
  },
  { timestamps: true }
);

const OrderModel = model<IOrder>("Order", orderSchema);
export default OrderModel;
