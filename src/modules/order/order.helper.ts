import { OrderStatus, PaymentStatus, PaymentType } from "./models/order.model";

export const orderStatus = {
  vi: {
    Pending: "Đang chờ xử lý",
    Shipping: "Đang vận chuyển",
    Delivered: "Đã giao",
    Canceled: "Đã hủy",
    Returned: "Đã hoàn hàng",
  },
  en: {
    Pending: "Pending",
    Shipping: "Shipping",
    Delivered: "Delivered",
    Canceled: "Canceled",
    Returned: "Returned",
  },
};

export const paymentStatus = {
  vi: {
    Unpaid: "Chưa thanh toán",
    Paid: "Đã thanh toán",
  },
  en: {
    Unpaid: "Unpaid",
    Paid: "Paid",
  },
};

export const paymentType = {
  vi: {
    COD: "Thanh toán khi nhận hàng",
    VNPAY: "Thanh toán qua ví VNPay",
  },
  en: {
    COD: "Cash on Delivery",
    VNPAY: "VNPay Wallet",
  },
};

export function getOrderStatus(status: OrderStatus, lang: "vi" | "en") {
  return orderStatus[lang][status];
}

export function getPaymentStatus(status: PaymentStatus, lang: "vi" | "en") {
  return paymentStatus[lang][status];
}

export function getPaymentType(type: PaymentType, lang: "vi" | "en") {
  return paymentType[lang][type];
}
