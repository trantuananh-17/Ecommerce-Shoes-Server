import { Request } from "express";

export type TranslateFunction = (key: string, ...args: any[]) => string;

declare global {
  namespace Express {
    interface Request {
      lang?: string;
    }
  }
}
