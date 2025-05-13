import { Document, model, Schema } from "mongoose";
import { Gender } from "../../user/user.model";

type ProductImage = { url: string; id: string };

enum ShoeCollarType {
  LowCut = "Giày cổ thấp",
  MidCut = "Giày cổ vừa",
  HighCut = "Giày cổ cao",
}

export interface Product extends Document {
  name: string;
  brand: Schema.Types.ObjectId;
  price: number;
  description: string;
  warranty: string;
  isActive: boolean;
  gender: Gender;
  shoeCollarType: ShoeCollarType;
  category: Schema.Types.ObjectId;
  material: Schema.Types.ObjectId;
  closure: Schema.Types.ObjectId;
  eventDiscounts: Schema.Types.ObjectId;
  colorSize: Schema.Types.ObjectId[];
  ratings: Schema.Types.ObjectId[];
  averageRating: number;
}

const productSchema: Schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    warranty: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    gender: {
      type: String,
      enum: Object.values(ShoeCollarType),
      required: true,
    },
    shoeCollarType: {
      type: String,
      enum: Object.values(Gender),
      required: false,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    material: { type: Schema.Types.ObjectId, ref: "Material", required: true },
    closure: { type: Schema.Types.ObjectId, ref: "Closure", required: true },
    eventDiscounts: { type: Schema.Types.ObjectId, ref: "EventDiscount" },
    colorSize: [{ type: Schema.Types.ObjectId, ref: "ColorSize" }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "ProductRate" }],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductModel = model("Product", productSchema);
export default ProductModel;
