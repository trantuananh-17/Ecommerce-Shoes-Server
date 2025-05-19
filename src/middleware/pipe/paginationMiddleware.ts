import { Request, Response, NextFunction } from "express";

export function paginationMiddleware(defaultLimit = 12, maxLimit = 100) {
  return (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || defaultLimit;

    // Giới hạn số lượng tối đa mỗi trang
    limit = Math.min(limit, maxLimit);

    req.pagination = {
      page,
      limit,
    };

    next();
  };
}
