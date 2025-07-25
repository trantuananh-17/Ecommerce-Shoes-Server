import { IOrderItem } from "./models/order-item.model";
import { IOrder } from "./models/order.model";
import { IOrderDetailResponse, IOrderResponse } from "./order.dto";
import {
  getOrderStatus,
  getPaymentStatus,
  getPaymentType,
} from "./order.helper";

export const orderResponseMapper = (
  order: IOrder,
  lang: "vi" | "en"
): IOrderResponse => {
  return {
    id: order._id.toString(),
    name: order.toName,
    phone: order.toPhone,
    province: order.toProvince,
    orderStatus: getOrderStatus(order.orderStatus, lang),
    paymentType: getPaymentType(order.paymentType, lang),
  };
};

export const orderDetailResponseMapper = (
  order: IOrder,
  lang: "vi" | "en",
  discountValue: number
): IOrderDetailResponse => {
  return {
    id: order._id.toString(),
    orderStatus: getOrderStatus(order.orderStatus, lang),
    paymentStatus: getPaymentStatus(order.paymentStatus, lang),
    paymentType: getPaymentType(order.paymentType, lang),
    discount: discountValue,
    name: order.toName,
    phone: order.toPhone,
    email: order.toEmail,
    province: order.toProvince,
    district: order.toDistrict,
    ward: order.toWard,
    address: order.toAddress,
    note: order.orderNote![lang],
    orderItemsPrices: order.orderItemsPrices,
    orderTotalPrices: order.orderTotalPrices,
    datePayment: order.datePayment?.toISOString() ?? null,
    dateReceive: order.dateReceive?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
  };
};

export const orderItemResponseMapper = (
  orderItem: IOrderItem,
  lang: "vi" | "en"
) => {
  return {
    id: orderItem._id.toString(),
    productName: orderItem.productName[lang],
    price: orderItem.discountedPrice,
    quantity: orderItem.quantity,
    totalPrice: orderItem.totalPrice,
  };
};
