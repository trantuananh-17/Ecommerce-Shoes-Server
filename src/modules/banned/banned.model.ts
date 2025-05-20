import { Schema, model, Document } from "mongoose";

export interface IBanned extends Document {
  _id: Schema.Types.ObjectId;
  word: {
    vi: string;
    en: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bannedSchema: Schema = new Schema<IBanned>(
  {
    word: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const BannedModel = model<IBanned>("Banned", bannedSchema);
export default BannedModel;
