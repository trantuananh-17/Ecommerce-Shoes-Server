import { Router } from "express";
import AuthRole from "../../middleware/auth.middleware";
import {
  cancelOrderController,
  createOrderController,
  updateOrderController,
} from "./order.controller";

const orderRouter = Router();

orderRouter.post("/", AuthRole("*", true), createOrderController); // Thêm
orderRouter.patch("/:id", AuthRole("admin", true), updateOrderController); //Cập nhật đơn hàng
orderRouter.patch(
  "/cancel/:id",
  AuthRole("admin", true),
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
