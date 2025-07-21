import { Router } from "express";
import AuthRole from "../../middleware/auth.middleware";
import {
  cancelOrderController,
  createOrderController,
  updateOrderController,
} from "./order.controller";
import authMiddleware from "../../middleware/auth.middleware";
import roleMiddleware from "../../middleware/role.middleware";

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

// orderRouter.delete("/:id"); //Xóa đơn hàng(admin)
// orderRouter.get("/"); // Get all (admin)
// orderRouter.get("/:id"); //Get by id(admin)

// // me
// orderRouter.get("/me");
// orderRouter.post("/me/cancel/:orderId");
// orderRouter.get("/me/:orderId");
export default orderRouter;
