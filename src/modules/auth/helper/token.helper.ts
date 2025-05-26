import jwt, { Secret, SignOptions } from "jsonwebtoken";
import ms from "ms";

export interface TokenPayload {
  id: string;
  email: string;
  role: "user" | "admin";
  loginType: "local" | "facebook" | "google";
}

export const generateToken = async (
  payload: TokenPayload,
  secretKey: Secret,
  expire: ms.StringValue
): Promise<string> => {
  const options: SignOptions = { expiresIn: expire };
  const token = jwt.sign(payload, secretKey, options);
  return token;
};
