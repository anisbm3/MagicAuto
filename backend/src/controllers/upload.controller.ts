import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const uploadImages = (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Aucun fichier uploadé." });
    }
    // Build absolute URLs so the frontend (served from a different origin)
    // can render them directly.
    const urls = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
    res.json({ urls });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Failed to upload images" });
  }
};
