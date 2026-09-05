import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const newAppt = await prisma.appointment.create({ data: req.body });
    res.json(newAppt);
  } catch (err) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

export const getAvailability = async (req: Request, res: Response) => {
  // Basic mock availability
  res.json(["09:00", "10:30", "14:00", "15:30"]);
};

export const listAppointmentsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    // Doing a manual join or fetching services alongside to enrich
    const apps = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      include: { service: true },
    });

    const enriched = apps.map(({ service, ...app }) => ({
      ...app,
      serviceName: service ? service.name : "Service supprimé",
      serviceCategory: service ? service.category : "",
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await prisma.appointment.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update appointment status" });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.appointment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
