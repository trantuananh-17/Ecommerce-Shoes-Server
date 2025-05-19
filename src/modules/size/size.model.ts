import { Document, model, Schema, Types } from "mongoose";

export interface ISize extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const sizeSchema: Schema = new Schema<ISize>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const SizeModel = model<ISize>("Size", sizeSchema);
export default SizeModel;
