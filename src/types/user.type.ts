import mongoose from "mongoose";

export interface IUserPayload {
  _id: mongoose.Schema.Types.ObjectId;
  role: string;
  fullname: string;
  email: string;
}
