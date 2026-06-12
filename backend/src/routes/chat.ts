import { Router } from "express";

export const chatRouter = Router();

// POST /api/chat { mensaje, sessionId }
chatRouter.post("/", async (_req, res) => {
  res.json({ respuesta: "TODO: integrar motor conversacional" });
});
