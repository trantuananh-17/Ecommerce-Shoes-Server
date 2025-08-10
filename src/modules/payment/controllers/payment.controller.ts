import { Request, RequestHandler, Response } from "express";
import Joi from "joi";
import { getClientIp } from "../utils/vnpay.util";
import { VnPayService } from "../services/payment.service";
import OrderModel, {
  OrderStatus,
  PaymentStatus,
} from "../../order/models/order.model";
import { getIO } from "../../../config/socket.config";
const FRONTEND_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

const createPaymentSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "amount must be a number",
    "number.positive": "amount must be > 0",
    "any.required": "amount is required",
  }),
  bankCode: Joi.string().optional(),
  language: Joi.string().valid("vn", "en").optional(),
  orderId: Joi.string().required(),
});

const vnpReturnSchema = Joi.object({
  vnp_SecureHash: Joi.string().required(),
  vnp_TxnRef: Joi.string().required(),
  vnp_ResponseCode: Joi.string().required(),
  vnp_Amount: Joi.string().regex(/^\d+$/).required(),
}).unknown(true);

const queryDrSchema = Joi.object({
  orderId: Joi.string().required(),
  transDate: Joi.string()
    .pattern(/^\d{14}$/)
    .required(),
});

export const createPaymentUrl: RequestHandler = (
  req: Request,
  res: Response
) => {
  const { error, value } = createPaymentSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400).json({
      message: "Invalid request",
      errors: error.details.map((d) => d.message),
    });
    return;
  }

  try {
    const ip = getClientIp(req);

    const { url } = VnPayService.createPaymentUrl({
      amount: value.amount,
      bankCode: value.bankCode,
      language: value.language ?? "vn",
      orderId: value.orderId,
      ipAddr: ip,
    });

    // res.json({ url });
    res.redirect(url);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const vnpayReturn: RequestHandler = async (req, res): Promise<void> => {
  const { error } = vnpReturnSchema.validate(req.query, { abortEarly: false });
  if (error) {
    res.redirect(`${FRONTEND_URL}/order/vnpay_return?code=99`);
    return;
  }

  const parsed = VnPayService.parseReturn(req.query as Record<string, string>);
  if (!parsed.isValid) {
    res.redirect(`${FRONTEND_URL}/order/vnpay_return?code=97`);
    return;
  }

  // lấy đơn theo _id = vnp_TxnRef
  const order = await OrderModel.findById(parsed.txnRef);
  if (!order) {
    res.redirect(`${FRONTEND_URL}/order/vnpay_return?code=01`);
    return;
  }

  if (Number(order.orderTotalPrices) !== Number(parsed.amount)) {
    res.redirect(`${FRONTEND_URL}/order/vnpay_return?code=02`);
    return;
  }

  // user cancel
  if (parsed.responseCode === "24") {
    if (order.paymentStatus !== PaymentStatus.Paid) {
      order.paymentStatus = PaymentStatus.Unpaid;
      order.orderStatus = OrderStatus.Canceled;
      await order.save();
    }
    getIO().emit("updateOrderInfo");
    res.redirect(
      `${FRONTEND_URL}/order/vnpay_return?code=24&orderId=${order._id}`
    );
    return;
  }

  try {
    const dr = await VnPayService.queryDr({
      orderId: parsed.txnRef!,
      transDate: parsed.payDate!,
      ipAddr: getClientIp(req),
    });
    const ok =
      dr?.vnp_ResponseCode === "00" && dr?.vnp_TransactionStatus === "00";

    if (ok && order.paymentStatus !== PaymentStatus.Paid) {
      order.paymentStatus = PaymentStatus.Paid;
      order.orderStatus = OrderStatus.Pending;
      order.datePayment = new Date();

      getIO().emit("updateOrderInfo");

      await order.save();
    }

    res.redirect(
      `${FRONTEND_URL}/order/vnpay_return?code=${
        ok ? "00" : parsed.responseCode
      }&orderId=${order._id}`
    );
    return;
  } catch {
    res.redirect(
      `${FRONTEND_URL}/order/vnpay_return?code=${parsed.responseCode}&orderId=${order._id}`
    );
    return;
  }
};

export const vnpayIpn: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = vnpReturnSchema.validate(req.query, { abortEarly: false });
  if (error) {
    res.json({ RspCode: "99", Message: "Invalid query" });
    return;
  }

  const r = VnPayService.parseIpn(
    req.query as Record<string, string | undefined>
  );
  if (r.rspCode !== "00") {
    res.json({ RspCode: "97", Message: "Checksum failed" });
    return;
  }

  const { txnRef, amount, responseCode } = r.data;

  const order = await OrderModel.findOne({ txnRef });
  if (!order) {
    res.json({ RspCode: "01", Message: "Order not found" });
    return;
  }

  if (Number(order.orderTotalPrices) !== Number(amount)) {
    res.json({ RspCode: "02", Message: "Invalid amount" });
    return;
  }

  if (responseCode === "00") {
    order.paymentStatus = PaymentStatus.Paid;
    order.orderStatus = OrderStatus.Pending;
    order.datePayment = new Date();
  } else if (responseCode === "24") {
    order.paymentStatus = PaymentStatus.Unpaid;
    order.orderStatus = OrderStatus.Canceled;
  } else {
    order.paymentStatus = PaymentStatus.Unpaid;
  }
  await order.save();

  res.json({ RspCode: "00", Message: "Confirm Success" });
  return;
};

export const queryDr: RequestHandler = async (req, res) => {
  const { error, value } = queryDrSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).json({
      message: "Invalid request",
      errors: error.details.map((d) => d.message),
    });
    return;
  }

  try {
    const data = await VnPayService.queryDr({
      orderId: value.orderId,
      transDate: value.transDate,
      ipAddr: getClientIp(req),
    });
    res.json(data);
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "VNPay querydr failed" });
    return;
  }
};

const refundSchema = Joi.object({
  orderId: Joi.string().required(),
  transDate: Joi.string()
    .pattern(/^\d{14}$/)
    .required(),
  amount: Joi.number().positive().required(),
  transType: Joi.string().required(),
  user: Joi.string().required(),
});

export const refund: RequestHandler = async (req, res) => {
  const { error, value } = refundSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).json({
      message: "Invalid request",
      errors: error.details.map((d) => d.message),
    });
    return;
  }

  try {
    const data = await VnPayService.refund({
      orderId: value.orderId,
      transDate: value.transDate,
      amount: value.amount,
      transType: value.transType,
      user: value.user,
      ipAddr: getClientIp(req),
    });
    res.json(data);
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "VNPay refund failed" });
    return;
  }
};
