import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
  _id: Schema.Types.ObjectId;
  name: {
    vi: string;
    en: string;
  };
  isActive: boolean;
  slug: {
    vi: string;
    en: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
    slug: {
      vi: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    },
  },
  { timestamps: true }
);

const CategoryModel = model<ICategory>("Category", categorySchema);
export default CategoryModel;
