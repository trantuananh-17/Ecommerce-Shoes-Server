import { Document, model, Schema } from "mongoose";

export enum Status {}

export interface IBrand extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  country: string;
  websiteUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema: Schema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BrandModel = model<IBrand>("Brand", brandSchema);
export default BrandModel;
