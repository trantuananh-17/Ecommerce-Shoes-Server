import { Schema, model, Document } from "mongoose";

interface Banner extends Document {
  word: string;
}

const bannerSchema: Schema = new Schema<Banner>({
  word: { type: String, required: true },
});

const BannerModel = model("Banner", bannerSchema);
export default BannerModel;
