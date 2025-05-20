import { Document, model, Schema, Types } from "mongoose";

export interface IColor extends Document {
  _id: Types.ObjectId;
  name: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const colorSchema: Schema = new Schema<IColor>(
  {
    name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ColorModel = model<IColor>("Color", colorSchema);
export default ColorModel;
