import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { signAdminToken } from "../utils/jwt.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(401).json({ error: "Identifiants incorrects" });

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    if (!user.active) {
      return res.status(401).json({ error: "Compte désactivé" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = signAdminToken({ id: user.id, username: user.username, role: user.role });

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Erreur serveur", detail: err instanceof Error ? err.message : String(err) });
  }
};

export const me = (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
};
