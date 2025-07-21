import mongoose from "mongoose";
import { TranslateFunction } from "../../types/express";
import {
  apiError,
  apiResponse,
  APIResponse,
} from "../../utils/helpers/api-response.helper";
import { tryCatchService } from "../../utils/helpers/trycatch.helper";
import HttpStatus from "../../utils/http-status.utils";
import CartModel from "../cart/cart.model";
import OrderItemModel from "./models/order-item.model";
import OrderModel, { OrderStatus, PaymentStatus } from "./models/order.model";
import { ICreateAndUpdateOrder } from "./order.dto";
import ProductModel from "../product/models/product.model";
import SizeQuantityModel from "../product/models/sizeQuantity.model";

export const createOrderService = async (
  userId: string,
  newOrder: ICreateAndUpdateOrder,
  __: TranslateFunction
): Promise<APIResponse<null>> => {
  return tryCatchService(
    async () => {
      const {
        paymentType,
        paymentStatus,
        discounts,
        orderNote,
        orderStatus,
        orderItem,
        orderItemsPrices,
        orderTotalPrices,
        toName,
        toPhone,
        toEmail,
        toProvince,
        toDistrict,
        toWard,
        toAddress,
      } = newOrder;

      if (!Array.isArray(orderItem) || orderItem.length === 0) {
        return apiError(HttpStatus.BAD_REQUEST, "Vui lòng chọn sản phẩm.");
      }

      for (const item of orderItem) {
        const sizeQuantity = await SizeQuantityModel.findOne({
          productId: item.productId,
          size: item.sizeId,
        });

        console.log(sizeQuantity);

        if (!sizeQuantity) {
          return apiError(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm.");
        }
        console.log(sizeQuantity.quantity, item.quantity);

        if (sizeQuantity.quantity < item.quantity) {
          return apiError(
            HttpStatus.BAD_REQUEST,
            "Không đủ số lượng cho sản phẩm vui lòng kiểm tra lại"
          );
        }
      }

      const order = new OrderModel({
        userId,
        paymentType,
        paymentStatus,
        discounts,
        orderNote,
        orderStatus,
        orderItem,
        orderItemsPrices,
        orderTotalPrices,
        toName,
        toPhone,
        toEmail,
        toProvince,
        toDistrict,
        toWard,
        toAddress,
      });

      const result = await order.save();

      if (!result) {
        return apiError(HttpStatus.BAD_REQUEST, "Tạo đơn hàng thất bại.");
      }

      const orderItemPromises = orderItem.map(async (item) => {
        const discount =
          item.price !== item.discountedPrice
            ? (item.discountedPrice / item.price) * 100
            : 0;
        const totalPrice = item.quantity * item.discountedPrice;
        const product = await ProductModel.findById(item.productId);
        const orderItemData = {
          orderId: result._id,
          productId: item.productId,
          productName: { vi: product?.name.vi, en: product?.name.en },
          slug: { vi: product?.slug.vi, en: product?.slug.en },
          quantity: item.quantity,
          price: item.price,
          discountedPrice: item.discountedPrice,
          discount,
          size: item.size,
          thumbnail: product?.thumbnail,
          totalPrice,
        };

        const orderItemResult = new OrderItemModel(orderItemData);

        await SizeQuantityModel.updateOne(
          {
            productId: item.productId,
            size: item.sizeId,
          },
          { $inc: { quantity: -item.quantity } }
        );

        return await orderItemResult.save();
      });

      const savedItems = await Promise.all(orderItemPromises);

      if (!savedItems || savedItems.length === 0) {
        return apiError(
          HttpStatus.BAD_REQUEST,
          "Lưu sản phẩm vào đơn hàng thất bại."
        );
      }

      await CartModel.updateOne(
        { user: new mongoose.Types.ObjectId(userId) },
        { $set: { products: [] } }
      );

      return apiResponse(HttpStatus.OK, "Tạo đơn hàng thành công");
    },
    "INTERNAL_SERVER_ERROR",
    "createOrderService",
    __
  );
};

export const updateOrderService = async (
  orderId: string,
  orderStatus: string,
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return apiError(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng.");
      }

      if (order.orderStatus === OrderStatus.Delivered) {
        return apiError(
          HttpStatus.BAD_REQUEST,
          "Bạn không thể cập nhật đơn hàng này nữa."
        );
      }

      if (orderStatus === "Đã giao") {
        order.orderStatus = OrderStatus.Delivered;
        order.paymentStatus = PaymentStatus.Paid;
        order.datePayment = new Date();
        order.dateReceive = new Date();
      } else {
        order.orderStatus = OrderStatus.Shipped;
      }

      await order.save();
      return apiResponse(HttpStatus.OK, "Cập nhật đơn hàng thành công");
    },
    "INTERNAL_SERVER_ERROR",
    "updateOrderService",
    __
  );
};

export const cancelOrderService = async (
  orderId: string,
  orderNote: string,
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return apiError(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng.");
      }

      if (
        order.orderStatus === OrderStatus.Shipped ||
        order.orderStatus === OrderStatus.Delivered
      ) {
        return apiError(
          HttpStatus.BAD_REQUEST,
          "Bạn không thể hủy đơn hàng đang vận chuyển."
        );
      }
      order.orderStatus = OrderStatus.Canceled;
      order.orderNote = orderNote;

      await order.save();
      return apiResponse(HttpStatus.OK, "Hủy đơn hàng thành công.");
    },
    "INTERNAL_SERVER_ERROR",
    "cancelOrderService",
    __
  );
};

export const deleteOrderrService = async (
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {},
    "INTERNAL_SERVER_ERROR",
    "deleteOrderrService",
    __
  );
};

export const getAllOrderService = async (
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {},
    "INTERNAL_SERVER_ERROR",
    "getAllOrderService",
    __
  );
};

export const getDetailsOrderService = async (
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {},
    "INTERNAL_SERVER_ERROR",
    "getDetailsOrderService",
    __
  );
};

export const getAllOrderOfMeService = async (
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {},
    "INTERNAL_SERVER_ERROR",
    "getAllOrderOfMeService",
    __
  );
};

export const cancelOrderOfMeService = async (
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {},
    "INTERNAL_SERVER_ERROR",
    "cancelOrderOfMeService",
    __
  );
};

export const getDetailsOrderOfMeService = async (
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {},
    "INTERNAL_SERVER_ERROR",
    "getDetailsOrderOfMeService",
    __
  );
};
