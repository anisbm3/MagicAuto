import { Router } from "express";
import { listVehicles, getVehicleById } from "../controllers/vehicles.controller.js";
import { listServices } from "../controllers/services.controller.js";
import { getSettings } from "../controllers/settings.controller.js";
import { createMessage } from "../controllers/messages.controller.js";
import { createAppointment, getAvailability } from "../controllers/appointments.controller.js";

const router = Router();

// === PUBLIC API ROUTES ===
router.get("/vehicles", listVehicles);
router.get("/vehicles/:slug", getVehicleById);
router.get("/services", listServices);
router.get("/settings", getSettings);
router.post("/contact", createMessage);
router.get("/appointments/availability", getAvailability);
router.post("/appointments", createAppointment);

export default router;
