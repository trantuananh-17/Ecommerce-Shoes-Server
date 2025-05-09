import { Document, model, Schema } from "mongoose";

export enum Status {}

export interface Brand extends Document {
  name: string;
  country: string;
  phoneNumber: string;
  websiteUrl: string;
  isActive: boolean;
}

const brandSchema: Schema = new Schema<Brand>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

const BrandModel = model("Brand", brandSchema);
export default BrandModel;
