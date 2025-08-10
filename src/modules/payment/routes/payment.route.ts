import { Router, Request, Response } from "express";

import {
  createPaymentUrl,
  queryDr,
  refund,
  vnpayIpn,
  vnpayReturn,
} from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/create_payment_url", createPaymentUrl);

paymentRouter.get("/vnpay_return", vnpayReturn);

paymentRouter.get("/vnpay_ipn", vnpayIpn);

// Admin/ops endpoints
paymentRouter.post("/querydr", queryDr);
paymentRouter.post("/refund", refund);

export default paymentRouter;
