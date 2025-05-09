import { Document, model, Schema } from "mongoose";

export interface Category extends Document {
  name: string;
}

const categorySchema: Schema = new Schema<Category>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const CategoryModel = model("Category", categorySchema);
export default CategoryModel;
