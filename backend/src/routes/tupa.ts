import { Router } from "express";

export const tupaRouter = Router();

// GET /api/tupa/tramites — lista de trámites y requisitos
tupaRouter.get("/tramites", (_req, res) => {
  res.json({ tramites: [] });
});
