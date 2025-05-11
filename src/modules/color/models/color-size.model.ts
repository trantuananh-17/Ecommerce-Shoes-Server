import { Document, model, Schema } from "mongoose";

type ProductImage = { url: string; id: string };

interface ColorSize extends Document {
  product: Schema.Types.ObjectId;
  color: Schema.Types.ObjectId;
  images: ProductImage[];
  sizes: {
    size: Schema.Types.ObjectId;
    quantity: number;
  }[];
}

const colorSizeSchema: Schema = new Schema<ColorSize>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  images: [
    {
      type: Object,
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
  ],
  sizes: [
    {
      size: { type: Schema.Types.ObjectId, ref: "Size" },
      quantity: { type: Number, required: true, default: 0 },
    },
  ],
});

const ColorSizeModel = model("ColorSize", colorSizeSchema);
export default ColorSizeModel;
