import { Router } from "express";
import AuthRole from "../../middleware/auth.middleware";
import {
  cancelOrderController,
  createOrderController,
  deleteOrderController,
  getAllOrderController,
  getDetailsOrderController,
  updateOrderController,
} from "./order.controller";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";
import { paginationMiddleware } from "../../middleware/pipe/paginationMiddleware";

const orderRouter = Router();

orderRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createOrderController
); // Thêm

orderRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateOrderController
); //Cập nhật đơn hàng

orderRouter.patch(
  "/cancel/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  cancelOrderController
); //Hủy đơn hàng(admin)

orderRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteOrderController
); //Xóa đơn hàng(admin)

orderRouter.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  paginationMiddleware(),
  getAllOrderController
); // Get all (admin)

orderRouter.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  getDetailsOrderController
); //Get by id(admin)

// // me
// orderRouter.get("/me");
// orderRouter.post("/me/cancel/:orderId");
// orderRouter.get("/me/:orderId");
export default orderRouter;
