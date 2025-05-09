import { Document, model, Schema } from "mongoose";
import { Address } from "../../address/models/address.model";

export enum Gender {
  MALE = "Nam",
  FEMALE = "Nữ",
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface User extends Document {
  email: string;
  password: string;
  fullname: string;
  phoneNumber: string;
  gender: Gender;
  birth: Date;
  province: string;
  district: string;
  ward: string;
  address: string;
  addresses: Schema.Types.ObjectId[];
  verified: boolean;
  isActive: boolean;
  tokens: string[];
  avatar: { url: string; id: string };
  role: Role;
}

const userSchema: Schema = new Schema<User>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    gender: { type: String, enum: Object.values(Gender), required: false },
    birth: { type: Date, required: false },
    province: { type: String, required: false },
    district: { type: String, required: false },
    ward: { type: String, required: false },
    address: { type: String, required: false },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tokens: [String],
    avatar: {
      type: Object,
      url: String,
      id: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
  },
  { timestamps: true }
);

const UserModel = model("User", userSchema);

export default UserModel;
