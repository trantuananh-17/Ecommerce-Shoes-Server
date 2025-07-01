import { model, Schema, Types } from "mongoose";

export interface Wishlist {
  user: Schema.Types.ObjectId;
  products: Types.ObjectId[];
}

const wishlistSchema: Schema = new Schema<Wishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const WishlistModel = model<Wishlist>("Wishlist", wishlistSchema);
export default WishlistModel;
