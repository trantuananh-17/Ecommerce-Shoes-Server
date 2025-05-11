import { Document, model, Schema } from "mongoose";

export interface Address extends Document {
  toName: string;
  toPhone: string;
  toProvince: string;
  toDistrict: string;
  toWard: string;
  toAddress: string;
  isActive: boolean;
  user: Schema.Types.ObjectId;
}

const addressSchema: Schema<Address> = new Schema({
  toName: { type: String, required: true },
  toPhone: { type: String, required: true },
  toProvince: { type: String, required: true },
  toDistrict: { type: String, required: true },
  toWard: { type: String, required: true },
  toAddress: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const AddressModel = model("Address", addressSchema);
export default AddressModel;
