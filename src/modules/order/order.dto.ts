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

export interface IOrderResponse {
  id: string;
  name: string;
  phone: string;
  province: string;
  orderStatus: string;
  paymentType: string;
}

export interface IOrderDetailResponse {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentType: string;
  discount?: number;
  name: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note?: string;
  orderItemsPrices: number;
  orderTotalPrices: number;
  createdAt: string;
  datePayment: string;
  dateReceive?: string;
}

export interface IOrderItemResponse {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}
