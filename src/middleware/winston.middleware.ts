import { Request, Response, NextFunction } from "express";
import logger from "../config/winston.config";

// Middleware log thời gian của mỗi API
const logRequestTime = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now(); // Thời gian bắt đầu

  res.on("finish", () => {
    const end = Date.now(); // Thời gian kết thúc
    const duration = end - start; // Thời gian thực thi

    // Log vào console và file với Winston
    logger.info(
      `Request to ${req.method} ${req.originalUrl} took ${duration}ms - ${res.statusCode}`
    );
  });

  next();
};

export default logRequestTime;
