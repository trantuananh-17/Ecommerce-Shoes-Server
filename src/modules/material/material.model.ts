import { Document, model, Schema } from "mongoose";

export interface Material extends Document {
  name: string;
  description: string;
}

const materialSchema: Schema = new Schema<Material>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const MaterialModel = model("Material", materialSchema);
export default MaterialModel;
