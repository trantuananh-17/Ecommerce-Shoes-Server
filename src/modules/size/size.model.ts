import { Document, model, Schema } from "mongoose";

export interface ISize extends Document {
  name: string;
}

const sizeSchema: Schema = new Schema<ISize>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const SizeModel = model("Size", sizeSchema);
export default SizeModel;
