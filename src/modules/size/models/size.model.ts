import { Document, model, Schema } from "mongoose";

export interface Size extends Document {
  name: string;
}

const sizeSchema: Schema = new Schema<Size>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const SizeModel = model("Size", sizeSchema);
export default SizeModel;
