import dayjs from "dayjs";
import qs from "qs";
import { paymentConfig } from "../../../config/payment.config";
import { signVnpayPayload, verifyVnpSignature } from "../utils/vnpay.util";
import axios from "axios";
import crypto from "crypto";

export interface CreatePaymentInput {
  amount: number;
  bankCode?: string;
  language?: "vn" | "en";
  orderId: string;
  ipAddr: string;
}

export interface QueryDrInput {
  orderId: string; // vnp_TxnRef
  transDate: string; // YYYYMMDDHHmmss
  ipAddr: string;
}

export interface RefundInput {
  orderId: string; // vnp_TxnRef
  transDate: string; // YYYYMMDDHHmmss (ngày giao dịch gốc)
  amount: number; // VND (đơn vị đồng)
  transType: string; // 02: refund một phần, 03: refund toàn phần... (tuỳ spec)
  user: string; // người thực hiện
  ipAddr: string;
}

export class VnPayService {
  static createPaymentUrl(input: CreatePaymentInput) {
    const now = dayjs();
    const createDate = now.format("YYYYMMDDHHmmss");
    const orderId = input.orderId;

    const vnp_Params: Record<string, string | number> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: paymentConfig.vnp_TmnCode,
      vnp_Locale: input.language || "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: input.orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD:${input.orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: Math.round(input.amount * 100),
      vnp_ReturnUrl: paymentConfig.vnp_ReturnUrl,
      vnp_IpAddr: input.ipAddr,
      vnp_CreateDate: createDate,
      ...(input.bankCode ? { vnp_BankCode: input.bankCode } : {}),
    };

    const { sorted, signed } = signVnpayPayload(
      vnp_Params,
      paymentConfig.vnp_HashSecret
    );
    (sorted as any)["vnp_SecureHash"] = signed;

    const url =
      paymentConfig.vnp_Url + "?" + qs.stringify(sorted, { encode: false });
    return { url, orderId, createdAt: createDate };
  }

  /** Xử lý dữ liệu trả về ở vnp_ReturnUrl (redirect từ VNPAY về FE/BE) */
  static parseReturn(query: Record<string, string | undefined>) {
    const isValid = verifyVnpSignature(query, paymentConfig.vnp_HashSecret);
    const code = query["vnp_ResponseCode"] || "99";
    const txnRef = query["vnp_TxnRef"];
    const amount = query["vnp_Amount"]
      ? Number(query["vnp_Amount"]) / 100
      : undefined;
    const bankCode = query["vnp_BankCode"];
    const payDate = query["vnp_PayDate"];
    const transactionNo = query["vnp_TransactionNo"];

    return {
      isValid,
      responseCode: code,
      txnRef,
      amount,
      bankCode,
      payDate,
      transactionNo,
      raw: query,
    };
  }

  /** Xử lý cho IPN (server-to-server) – khuyến nghị dùng để xác nhận đơn */
  static parseIpn(query: Record<string, string | undefined>) {
    const result = this.parseReturn(query);
    if (!result.isValid) {
      return { rspCode: "97", message: "Checksum failed", data: result };
    }
    return { rspCode: "00", message: "Confirm Success", data: result };
  }

  static async queryDr(input: QueryDrInput) {
    const now = dayjs();

    const vnp_RequestId = now.format("HHmmss");
    const vnp_Version = "2.1.0";
    const vnp_Command = "querydr";
    const vnp_TmnCode = paymentConfig.vnp_TmnCode;
    const vnp_TxnRef = input.orderId;
    const vnp_OrderInfo = `Truy van GD ma:${vnp_TxnRef}`;
    const vnp_TransactionDate = input.transDate;
    const vnp_CreateDate = now.format("YYYYMMDDHHmmss");

    const data = [
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TxnRef,
      vnp_TransactionDate,
      vnp_CreateDate,
      input.ipAddr,
      vnp_OrderInfo,
    ].join("|");

    const vnp_SecureHash = crypto
      .createHmac("sha512", paymentConfig.vnp_HashSecret)
      .update(Buffer.from(data, "utf-8"))
      .digest("hex");

    const body = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TxnRef,
      vnp_OrderInfo,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr: input.ipAddr,
      vnp_SecureHash,
    };

    const resp = await axios.post(paymentConfig.vnp_Api, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });
    return resp.data;
  }

  static async refund(input: RefundInput) {
    const now = dayjs();

    const vnp_RequestId = now.format("HHmmss");
    const vnp_Version = "2.1.0";
    const vnp_Command = "refund";
    const vnp_TmnCode = paymentConfig.vnp_TmnCode;
    const vnp_TxnRef = input.orderId;
    const vnp_Amount = Math.round(input.amount * 100);
    const vnp_TransactionType = input.transType;
    const vnp_CreateBy = input.user;
    const vnp_OrderInfo = `Hoan tien GD ma:${vnp_TxnRef}`;
    const vnp_TransactionDate = input.transDate;
    const vnp_CreateDate = now.format("YYYYMMDDHHmmss");
    const vnp_TransactionNo = "0";

    const data = [
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      input.ipAddr,
      vnp_OrderInfo,
    ].join("|");

    const vnp_SecureHash = crypto
      .createHmac("sha512", paymentConfig.vnp_HashSecret)
      .update(Buffer.from(data, "utf-8"))
      .digest("hex");

    const body = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_CreateBy,
      vnp_OrderInfo,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr: input.ipAddr,
      vnp_SecureHash,
    };

    const resp = await axios.post(paymentConfig.vnp_Api, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });
    return resp.data;
  }
}
