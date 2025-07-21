import { Document, model, Schema } from "mongoose";

export enum PaymentStatus {
  Unpaid = "Chưa thanh toán",
  Paid = "Đã thanh toán",
}

export enum OrderStatus {
  Pending = "Đang chờ xử lý",
  Shipped = "Đã vận chuyển",
  Delivered = "Đã giao",
  Canceled = "Đã hủy",
  Returned = "Đã hoàn hàng",
}

export interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  paymentType: boolean;
  paymentStatus: PaymentStatus;
  discounts?: Schema.Types.ObjectId;
  orderNote?: string;
  orderStatus?: OrderStatus;
  orderItemsPrices: number;
  orderTotalPrices: number;
  toName: string;
  toPhone: string;
  toEmail: string;
  toProvince: string;
  toDistrict: string;
  toWard: string;
  toAddress: string;
  datePayment?: Date;
  dateReceive?: Date;
}

const orderSchema: Schema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentType: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Unpaid,
    },
    discounts: {
      type: Schema.Types.ObjectId,
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
