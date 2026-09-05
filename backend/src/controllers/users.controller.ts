import { Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

const PUBLIC_USER_SELECT = { id: true, username: true, role: true, active: true, createdAt: true } as const;

export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const data = await prisma.user.findMany({
      select: PUBLIC_USER_SELECT,
      orderBy: { createdAt: "desc" },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || "ADMIN",
        active: true,
      },
      select: { id: true, username: true, role: true, active: true },
    });

    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent super admin from demoting or deactivating the last super admin
    if (req.body.role === "ADMIN" || req.body.active === false) {
      const targetUser = await prisma.user.findUnique({ where: { id: userId } });
      if (targetUser?.role === "SUPER_ADMIN") {
        const superAdmins = await prisma.user.findMany({ where: { role: "SUPER_ADMIN" } });
        if (superAdmins.length <= 1) {
          return res.status(400).json({ error: "Cannot modify the last SUPER_ADMIN" });
        }
      }
    }

    const updates: any = {
      role: req.body.role,
      active: req.body.active,
    };

    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: { id: true, username: true, role: true, active: true },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });

    if (targetUser?.role === "SUPER_ADMIN") {
      const superAdmins = await prisma.user.findMany({ where: { role: "SUPER_ADMIN" } });
      if (superAdmins.length <= 1) {
        return res.status(400).json({ error: "Cannot delete the last SUPER_ADMIN" });
      }
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
