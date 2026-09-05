import { Response } from "express";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const listServices = async (req: AuthRequest, res: Response) => {
  try {
    const data = await prisma.service.findMany();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const newService = await prisma.service.create({ data: req.body });
    res.json(newService);
  } catch (err) {
    res.status(500).json({ error: "Failed to create service" });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await prisma.service.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update service" });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.service.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};
