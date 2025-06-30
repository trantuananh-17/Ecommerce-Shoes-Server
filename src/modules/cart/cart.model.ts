import { model, Schema } from "mongoose";

export interface Cart {
  user: Schema.Types.ObjectId;
  products: {
    sizeQuantity: Schema.Types.ObjectId;
    quantity: number;
  }[];
}

const cartSchema: Schema = new Schema<Cart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        sizeQuantity: {
          type: Schema.Types.ObjectId,
          ref: "SizeQuantity",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = model<Cart>("Cart", cartSchema);
export default CartModel;
