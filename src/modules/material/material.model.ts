import { Document, model, Schema, Types } from "mongoose";

export interface IMaterial extends Document {
  _id: Types.ObjectId;
  name: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema: Schema = new Schema<IMaterial>(
  {
    name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const MaterialModel = model<IMaterial>("Material", materialSchema);
export default MaterialModel;
