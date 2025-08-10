import dotenv from "dotenv";

dotenv.config();

export const paymentConfig = {
  vnp_TmnCode: process.env.VNP_TMNCODE!,
  vnp_HashSecret: process.env.VNP_HASHSECRET!,
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: `${process.env.BE_BASE_URL}/payments/vnpay_return`,
} as const;

export type PaymentConfig = typeof paymentConfig;
