import { Schema } from "mongoose";
import { OrderStatus, PaymentStatus } from "./models/order.model";

export type orderItem = {
  productId: string;
  size: string;
  sizeId: string;
  price: number;
  discountedPrice: number;
  quantity: number;
};

export interface ICreateAndUpdateOrder {
  paymentType?: boolean;
  paymentStatus?: PaymentStatus;
  discounts?: Schema.Types.ObjectId;
  orderNote?: string;
  orderStatus?: OrderStatus;
  orderItem: orderItem[];
  orderItemsPrices: number;
  orderTotalPrices: number;
  toName: string;
  toPhone: string;
  toEmail: string;
  toProvince: string;
  toDistrict: string;
  toWard: string;
  toAddress: string;
}
