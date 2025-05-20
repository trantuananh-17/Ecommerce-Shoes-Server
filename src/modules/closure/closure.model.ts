import { Document, model, Schema, Types } from "mongoose";

export interface IClosure extends Document {
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

const closureSchema: Schema = new Schema<IClosure>(
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

const ClosureModel = model<IClosure>("closure", closureSchema);
export default ClosureModel;
