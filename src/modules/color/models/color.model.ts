import { Document, model, Schema } from "mongoose";

export interface Color extends Document {
  name: {
    vi: string;
    en: string;
  };
}

const colorSchema: Schema = new Schema<Color>(
  {
    name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const ColorModel = model("Color", colorSchema);
export default ColorModel;
