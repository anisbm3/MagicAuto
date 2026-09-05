import { Response } from "express";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const listVehicles = async (req: AuthRequest, res: Response) => {
  try {
    const data = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

export const getVehicleById = async (req: AuthRequest, res: Response) => {
  try {
    // For now, assuming slug is ID for simplicity, or we match by ID
    const data = await prisma.vehicle.findUnique({ where: { id: parseInt(req.params.id ?? req.params.slug) } });
    res.json(data || null);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
};

export const createVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const newVehicle = await prisma.vehicle.create({ data: req.body });
    res.json(newVehicle);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Failed to create vehicle" });
  }
};

export const updateVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await prisma.vehicle.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.vehicle.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
};
