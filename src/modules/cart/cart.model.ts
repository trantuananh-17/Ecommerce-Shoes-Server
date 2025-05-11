import { Document, model, Schema } from "mongoose";

export interface Cart {
  user: Schema.Types.ObjectId;
  products: {
    product: Schema.Types.ObjectId;
    quantity: number;
  }[];
}

const cartSchema: Schema = new Schema<Cart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = model("Cart", cartSchema);
export default CartModel;
