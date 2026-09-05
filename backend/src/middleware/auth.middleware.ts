import { Request, Response, NextFunction } from "express";
import { verifyAdminToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.cookies.admin_token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.user = verifyAdminToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Forbidden: Super Admin only" });
  }
  next();
};
