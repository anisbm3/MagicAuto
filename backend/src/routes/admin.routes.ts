import { Router } from "express";
import { requireAuth, requireSuperAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import multer from "multer";
import { NextFunction, Request, Response } from "express";

import { login, me, logout } from "../controllers/auth.controller.js";
import { getStats } from "../controllers/stats.controller.js";
import { listUsers, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";
import {
  listVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicles.controller.js";
import {
  listAppointmentsAdmin,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointments.controller.js";
import { listServices, createService, updateService, deleteService } from "../controllers/services.controller.js";
import { listMessagesAdmin, updateMessageStatus, deleteMessage } from "../controllers/messages.controller.js";
import { listReviewsAdmin, createReview, updateReview, deleteReview } from "../controllers/reviews.controller.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { uploadImages } from "../controllers/upload.controller.js";

const router = Router();

// === Authentication ===
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

// === Uploads ===
router.post(
  "/upload",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "Cette image est trop volumineuse. (Max 5MB)" });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadImages
);

// === Dashboard Stats ===
router.get("/stats", requireAuth, getStats);

// === Users (Super Admin Only) ===
router.get("/users", requireAuth, requireSuperAdmin, listUsers);
router.post("/users", requireAuth, requireSuperAdmin, createUser);
router.put("/users/:id", requireAuth, requireSuperAdmin, updateUser);
router.delete("/users/:id", requireAuth, requireSuperAdmin, deleteUser);

// === Vehicles ===
router.get("/vehicles", requireAuth, listVehicles);
router.post("/vehicles", requireAuth, createVehicle);
router.put("/vehicles/:id", requireAuth, updateVehicle);
router.delete("/vehicles/:id", requireAuth, deleteVehicle);
router.get("/vehicles/:id", requireAuth, getVehicleById);

// === Appointments ===
router.get("/appointments", requireAuth, listAppointmentsAdmin);
router.put("/appointments/:id/status", requireAuth, updateAppointmentStatus);
router.delete("/appointments/:id", requireAuth, deleteAppointment);

// === Services ===
router.get("/services", requireAuth, listServices);
router.post("/services", requireAuth, createService);
router.put("/services/:id", requireAuth, updateService);
router.delete("/services/:id", requireAuth, deleteService);

// === Messages ===
router.get("/messages", requireAuth, listMessagesAdmin);
router.put("/messages/:id/status", requireAuth, updateMessageStatus);
router.delete("/messages/:id", requireAuth, deleteMessage);

// === Reviews ===
router.get("/reviews", requireAuth, listReviewsAdmin);
router.post("/reviews", requireAuth, createReview);
router.put("/reviews/:id", requireAuth, updateReview);
router.delete("/reviews/:id", requireAuth, deleteReview);

// === Settings ===
router.get("/settings", requireAuth, getSettings);
router.put("/settings", requireAuth, updateSettings);

export default router;
