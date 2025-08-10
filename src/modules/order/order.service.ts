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
import OrderModel, {
  IOrder,
  OrderStatus,
  PaymentStatus,
} from "./models/order.model";
import {
  ICreateAndUpdateOrder,
  IOrderDetailResponse,
  IOrderItemResponse,
  IOrderResponse,
} from "./order.dto";
import ProductModel from "../product/models/product.model";
import SizeQuantityModel from "../product/models/sizeQuantity.model";
import {
  orderDetailResponseMapper,
  orderItemResponseMapper,
  orderResponseMapper,
} from "./order.mapper";
import DiscountModel from "../discount/discount.model";
import { getIO } from "../../config/socket.config";
import { VnPayService } from "../payment/services/payment.service";
import { getClientIp } from "../payment/utils/vnpay.util";

export const createOrderService = async (
  userId: string,
  newOrder: ICreateAndUpdateOrder,
  clientIp: string,
  __: TranslateFunction
): Promise<
  APIResponse<{ orderId: string; paymentUrl?: string; txnRef?: string }>
> => {
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
        bankCode,
        language,
      } = newOrder;

      // validate & check tồn kho (giữ nguyên)
      if (!Array.isArray(orderItem) || orderItem.length === 0) {
        return apiError(HttpStatus.BAD_REQUEST, "Vui lòng chọn sản phẩm.");
      }
      for (const item of orderItem) {
        const sizeQuantity = await SizeQuantityModel.findOne({
          productId: item.productId,
          size: item.sizeId,
        });
        if (!sizeQuantity)
          return apiError(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm.");
        if (sizeQuantity.quantity < item.quantity) {
          return apiError(
            HttpStatus.BAD_REQUEST,
            "Không đủ số lượng cho sản phẩm vui lòng kiểm tra lại"
          );
        }
      }

      // tạo order
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
      if (!result)
        return apiError(HttpStatus.BAD_REQUEST, "Tạo đơn hàng thất bại.");

      // tạo order items + trừ kho + emit (giữ nguyên)
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
          sizeId: item.sizeId,
          thumbnail: product?.thumbnail,
          totalPrice,
        };
        const orderItemResult = new OrderItemModel(orderItemData);
        await SizeQuantityModel.updateOne(
          { productId: item.productId, size: item.sizeId },
          { $inc: { quantity: -item.quantity } }
        );
        const updatedSizeQuantity = await SizeQuantityModel.findOne({
          productId: item.productId,
          size: item.sizeId,
        });
        getIO().emit("stockUpdated", {
          productId: item.productId,
          size: item.size,
          sizeId: item.sizeId,
          quantity: updatedSizeQuantity?.quantity ?? 0,
        });
        return orderItemResult.save();
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

      if (paymentType === "VNPAY") {
        const lang: "vn" | "en" = language === "en" ? "en" : "vn";

        const { url, orderId: txnRef } = VnPayService.createPaymentUrl({
          orderId: String(result._id),
          amount: orderTotalPrices,
          bankCode,
          language: lang,
          ipAddr: clientIp,
        });

        await OrderModel.updateOne(
          { _id: result._id },
          {
            $set: {
              txnRef,
              paymentGateway: "VNPAY",
              paymentStatus: PaymentStatus.Unpaid,
            },
          }
        );

        return apiResponse(HttpStatus.OK, "Tạo đơn hàng thành công", {
          orderId: String(result._id),
          paymentUrl: url,
          txnRef,
        });
      }

      return apiResponse(HttpStatus.OK, "Tạo đơn hàng thành công", {
        orderId: String(result._id),
      });
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

      if (orderStatus === "delivered") {
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
  orderNote: { vi: string; en: string },
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return apiError(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng.");
      }

      // if (
      //   order.orderStatus === OrderStatus.Shipped ||
      //   order.orderStatus === OrderStatus.Delivered
      // ) {
      //   return apiError(
      //     HttpStatus.BAD_REQUEST,
      //     "Bạn không thể hủy đơn hàng đang vận chuyển."
      //   );
      // }
      order.orderStatus = OrderStatus.Canceled;
      order.orderNote!.vi = orderNote.vi;
      order.orderNote!.en = orderNote.en;

      await order.save();

      const orderItem = await OrderItemModel.find({ orderId });

      await Promise.all(
        orderItem.map(async (item) => {
          await SizeQuantityModel.updateOne(
            {
              productId: item.productId,
              size: item.sizeId,
            },
            { $inc: { quantity: +item.quantity } }
          );
        })
      );

      return apiResponse(HttpStatus.OK, "Hủy đơn hàng thành công.");
    },
    "INTERNAL_SERVER_ERROR",
    "cancelOrderService",
    __
  );
};

export const deleteOrderService = async (
  userId: string,
  orderId: string,
  __: TranslateFunction
): Promise<any> => {
  return tryCatchService(
    async () => {
      const deletedOrderItems = await OrderItemModel.deleteMany({ orderId });

      if (deletedOrderItems.deletedCount === 0) {
        return apiError(
          HttpStatus.NOT_FOUND,
          "Không tìm thấy mục đơn hàng để xóa."
        );
      }

      const deletedOrder = await OrderModel.findByIdAndDelete({
        _id: orderId,
        userId,
      });

      if (!deletedOrder) {
        return apiError(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng.");
      }

      return apiResponse(HttpStatus.OK, "Xóa đơn hàng thành công.");
    },
    "INTERNAL_SERVER_ERROR",
    "deleteOrderrService",
    __
  );
};

export const getAllOrderService = async (
  lang: "vi" | "en",
  page: number,
  limit: number,
  __: TranslateFunction,
  status?: string
): Promise<
  APIResponse<{
    data: IOrderResponse[];
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }>
> => {
  return tryCatchService(
    async () => {
      const skip = (page - 1) * limit;

      const filter: any = {};

      if (status?.trim()) {
        const searchRegex = new RegExp(status.trim(), "i");
        filter.$or = [{ orderStatus: searchRegex }];
      }

      const aggr = await OrderModel.aggregate([
        { $match: filter },
        {
          $facet: {
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  _id: 1,
                  toName: 1,
                  toPhone: 1,
                  toProvince: 1,
                  orderStatus: 1,
                  paymentType: 1,
                },
              },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);

      const result = aggr[0] as {
        data: IOrder[];
        totalCount: { count: number }[];
      };

      const totalDocs = result.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalDocs / limit);

      const order = result.data.map((item) => orderResponseMapper(item, lang));

      return apiResponse(HttpStatus.OK, "Lấy danh sách đơn hàng thành công.", {
        data: order,
        totalDocs,
        totalPages,
        currentPage: page,
        limit,
      });
    },
    "INTERNAL_SERVER_ERROR",
    "getAllOrderService",
    __
  );
};

export const getDetailsOrderService = async (
  orderId: string,
  lang: "vi" | "en",
  __: TranslateFunction
): Promise<
  APIResponse<{
    orderInfo: IOrderDetailResponse;
    orderItemsInfo: IOrderItemResponse[];
  }>
> => {
  return tryCatchService(
    async () => {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return apiError(HttpStatus.NOT_FOUND, "Order not found");
      }

      const orderItems = await OrderItemModel.find({ orderId });

      if (!orderItems) {
        return apiError(HttpStatus.NOT_FOUND, "Order not found");
      }

      let discountValue = 0;

      if (order.discounts) {
        const discount = await DiscountModel.findById(order.discounts);
        if (discount) {
          if (discount.discountCost != null) {
            discountValue = discount.discountCost;
          } else if (discount.discountPercentage != null) {
            discountValue =
              (order.orderTotalPrices * discount.discountPercentage) / 100;
          }
        }
      }

      const orderInfo = orderDetailResponseMapper(order, lang, discountValue);
      const orderItemsInfo = orderItems.map((item) =>
        orderItemResponseMapper(item, lang)
      );
      return apiResponse(HttpStatus.OK, "Lấy thong tin đơn hàng thành công.", {
        orderInfo,
        orderItemsInfo,
      });
    },
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
