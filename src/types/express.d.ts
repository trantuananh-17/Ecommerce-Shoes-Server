import { Request } from "express";

export type TranslateFunction = (key: string, ...args: any[]) => string;

declare global {
  namespace Express {
    interface Request {
      lang?: string;
    }
    interface Request {
      pagination?: {
        page: number;
        limit: number;
      };
    }
    interface Request {
      userId?: Types.ObjectId;
    }

    interface Request {
      files: { [key: string]: File | File[] };
    }
  }
}
