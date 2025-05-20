import { Document, model, Schema } from "mongoose";

export interface Material extends Document {
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

const materialSchema: Schema = new Schema<Material>(
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

const MaterialModel = model("Material", materialSchema);
export default MaterialModel;
