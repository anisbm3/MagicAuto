import { Response } from "express";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const data = await prisma.setting.findFirst();
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.setting.findFirst();
    if (!existing) {
      const newSettings = await prisma.setting.create({ data: req.body });
      res.json(newSettings);
    } else {
      const updated = await prisma.setting.update({
        where: { id: existing.id },
        data: req.body,
      });
      res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};
