import { Document, model, Schema } from "mongoose";

export interface UserDiscount {
  user: Schema.Types.ObjectId;
  discount: Schema.Types.ObjectId;
  useAt: Date;
}

const userDiscountSchemma: Schema = new Schema<UserDiscount>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  discount: { type: Schema.Types.ObjectId, ref: "Discount" },
  useAt: { type: Date, required: true },
});

const UserDiscountModel = model("UserDiscount", userDiscountSchemma);
export default UserDiscountModel;
