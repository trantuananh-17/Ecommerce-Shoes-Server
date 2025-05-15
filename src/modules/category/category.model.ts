import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
  _id: Schema.Types.ObjectId;
  name: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  createdAt: Date;
}

const categorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CategoryModel = model<ICategory>("Category", categorySchema);
export default CategoryModel;
