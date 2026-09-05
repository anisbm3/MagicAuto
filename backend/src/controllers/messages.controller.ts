import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const newMsg = await prisma.message.create({ data: req.body });
    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const listMessagesAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const data = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const updateMessageStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await prisma.message.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update message status" });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.message.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
