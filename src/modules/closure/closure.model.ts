import { Document, model, Schema } from "mongoose";

export interface Closure extends Document {
  name: string;
  description: string;
}

const closureSchema: Schema = new Schema<Closure>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const ClosureSchema = model("closure", closureSchema);
export default ClosureSchema;
