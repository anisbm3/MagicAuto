import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { uploadDir } from "./middleware/upload.middleware.js";
import apiRouter from "./routes/index.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1); // Trust first proxy for secure cookies

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/uploads", express.static(uploadDir));

  app.use("/api", apiRouter);

  return app;
}
