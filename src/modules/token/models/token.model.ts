import mongoose, { Schema, Document } from "mongoose";

enum TokenType {
  RESET = "reset",
  VERIFY = "verify",
}

export interface TokenDocument extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  type: TokenType;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const tokenSchema = new Schema<TokenDocument>({
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
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 604800 });

const TokenModel = mongoose.model<TokenDocument>("Token", tokenSchema);
export default TokenModel;
