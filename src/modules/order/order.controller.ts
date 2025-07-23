import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import {
  cancelOrderService,
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  getDetailsOrderService,
  updateOrderService,
} from "./order.service";

export const createOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(
    async () => {
      const userId = req.user.userId;
      const response = await createOrderService(
        userId,
        req.body,
        req.__.bind(req)
      );
      res.status(response.status_code).json(response);
    },
    res,
    req,
    "createOrderController"
  );
};

export const updateOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(
    async () => {
      const orderId = req.params.id;
      const { orderStatus } = req.body;

      const response = await updateOrderService(
        orderId,
        orderStatus,
        req.__.bind(req)
      );
      res.status(response.status_code).json(response);
    },
    res,
    req,
    "updateOrderController"
  );
};

export const cancelOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(
    async () => {
      const orderId = req.params.id;
      const { orderNote } = req.body;

      const response = await cancelOrderService(
        orderId,
        orderNote,
        req.__.bind(req)
      );
      res.status(response.status_code).json(response);
    },
    res,
    req,
    "cancelOrderController"
  );
};

export const deleteOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(
    async () => {
      const userId = req.user.userId;

      const orderId = req.params.id;

      const response = await deleteOrderService(
        userId,
        orderId,
        req.__.bind(req)
      );
      res.status(response.status_code).json(response);
    },
    res,
    req,
    "deleteOrderController"
  );
};

export const getAllOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(
    async () => {
      const lang = req.lang === "en" ? "en" : "vi";

      const page = req.pagination?.page || 1;
      const limit = req.pagination?.limit || 12;

      const status =
        typeof req.query.status === "string"
          ? req.query.status.trim()
          : undefined;

      const response = await getAllOrderService(
        lang,
        page,
        limit,
        req.__.bind(req),
        status
      );
      res.status(response.status_code).json(response);
    },
    res,
    req,
    "getAllOrderController"
  );
};

export const getDetailsOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(
    async () => {
      const orderId = req.params.id;
      const lang = req.lang === "en" ? "en" : "vi";

      const response = await getDetailsOrderService(
        orderId,
        lang,
        req.__.bind(req)
      );
      res.status(response.status_code).json(response);
    },
    res,
    req,
    "getDetailsOrderController"
  );
};

export const getAllOrderOfMeController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(async () => {}, res, req, "getAllOrderOfMeController");
};

export const cancelOrderOfMeController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(async () => {}, res, req, "cancelOrderOfMeController");
};

export const getDetailsOrderOfMeController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(async () => {}, res, req, "getDetailsOrderOfMeController");
};
