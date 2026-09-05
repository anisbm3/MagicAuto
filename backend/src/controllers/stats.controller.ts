import { Response } from "express";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const allVehicles = await prisma.vehicle.findMany();
    const allAppointments = await prisma.appointment.findMany();
    const allServices = await prisma.service.findMany();
    const allMessages = await prisma.message.findMany();

    const stats = {
      vehicles: {
        total: allVehicles.length,
        disponibles: allVehicles.filter((v) => v.status === "Disponible").length,
        reservees: allVehicles.filter((v) => v.status === "Réservée").length,
        vendues: allVehicles.filter((v) => v.status === "Vendue").length,
      },
      appointments: {
        total: allAppointments.length,
        pending: allAppointments.filter((a) => a.status === "Pending").length,
        confirmed: allAppointments.filter((a) => a.status === "Confirmed").length,
        today: allAppointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length,
      },
      services: {
        total: allServices.length,
        active: allServices.filter((s) => s.active).length,
      },
      messages: {
        unread: allMessages.filter((m) => m.status === "Unread").length,
      },
    };
    res.json(stats);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
};
