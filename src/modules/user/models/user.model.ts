import { Document, model, Schema } from "mongoose";

type Avatar = { url: string; id: string };

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
  phoneNumber?: string;
  gender?: Gender;
  birth?: Date;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  addresses?: Schema.Types.ObjectId[];
  verified: boolean;
  isActive: boolean;
  refreshTokens: string[];
  avatar?: Avatar;
  role: Role;
  cart: Schema.Types.ObjectId;
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
    refreshTokens: { type: [String], default: [] },
    avatar: {
      type: Object,
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model("User", userSchema);

export default UserModel;
