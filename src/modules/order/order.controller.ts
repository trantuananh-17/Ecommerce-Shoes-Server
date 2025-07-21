import { Request, Response } from "express";
import { tryCatchController } from "../../utils/helpers/trycatch.helper";
import {
  cancelOrderService,
  createOrderService,
  updateOrderService,
} from "./order.service";

export const createOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(
    async () => {
      const userId = req.userId;
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
  tryCatchController(async () => {}, res, req, "deleteOrderController");
};

export const getAllOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(async () => {}, res, req, "getAllOrderController");
};

export const getDetailsOrderController = async (
  req: Request,
  res: Response
): Promise<any> => {
  tryCatchController(async () => {}, res, req, "getDetailsOrderController");
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
