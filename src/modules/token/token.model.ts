import { compare, genSalt, hash } from "bcrypt";
import mongoose, { Schema, Document, Model } from "mongoose";

export enum TokenType {
  RESET = "reset",
  VERIFY = "verify",
  CHANGE_PASSWORD = "change_password",
}

export interface TokenDocument extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  type: TokenType;
  isRevoked: boolean;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const tokenSchema = new Schema<
  TokenDocument,
  Model<TokenDocument, {}, Methods>,
  Methods
>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(TokenType),
    required: true,
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now,
  },
});

tokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
  }
  next();
});

tokenSchema.methods.compareToken = async function (token: string) {
  return await compare(token, this.token);
};

const TokenModel = mongoose.model<
  TokenDocument,
  Model<TokenDocument, {}, Methods>
>("Token", tokenSchema);

export default TokenModel;
