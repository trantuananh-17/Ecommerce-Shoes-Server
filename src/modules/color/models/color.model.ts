import { Document, model, Schema } from "mongoose";

export interface Color extends Document {
  name: string;
}

const colorSchema: Schema = new Schema<Color>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const ColorModel = model("Color", colorSchema);
export default ColorModel;
