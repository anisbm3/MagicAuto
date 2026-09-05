import { Response } from "express";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const listReviewsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const data = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const newReview = await prisma.review.create({ data: req.body });
    res.json(newReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to create review" });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await prisma.review.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update review" });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};
