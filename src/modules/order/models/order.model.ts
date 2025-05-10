import { Document, model, Schema } from "mongoose";

enum PaymentStatus {
  Unpaid = "Chưa thanh toán",
  Paid = "Đã thanh toán",
  Pending = "Đang chờ xử lý",
}

enum OrderStatus {
  Pending = "Đang chờ xử lý",
  Shipped = "Đã vận chuyển",
  Delivered = "Đã giao",
  Canceled = "Đã hủy",
}

export interface Order extends Document {
  user: Schema.Types.ObjectId;
  paymentType: boolean;
  paymentStatus: PaymentStatus;
  discounts: Schema.Types.ObjectId; // Có thể dùng nhiều mã
  orderStatus: OrderStatus;
  orderShipCost: number; // Có thể có bảng phí cost riêng cho tỉnh thành
  toName: string;
  toPhone: string;
  toEmail: string;
  toProvince: string;
  toDistrict: string;
  toWard: string;
  toAddress: string;
  orderNote: string;
  orderNoteCancelled: string;
  datePayment?: Date;
  dateReceive?: Date; // Thời gian nhận
  dateExpected?: Date; // Thời gian dự kiến
}

const orderSchema: Schema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentType: { type: Boolean, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
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
    orderShipCost: { type: Number, default: 0 },
    toName: { type: String, required: true },
    toPhone: { type: String, required: true },
    toEmail: { type: String, required: true },
    toProvince: { type: String, required: true },
    toDistrict: { type: String, required: true },
    toWard: { type: String, required: true },
    toAddress: { type: String, required: true },
    orderNote: { type: String, required: true },
    orderNoteCancelled: { type: String, required: true },
    datePayment: { type: Date, required: false },
    dateReceive: { type: Date, required: false },
    dateExpected: { type: Date, required: false },
  },
  { timestamps: true }
);

const OrderModel = model("Order", orderSchema);
export default OrderModel;
