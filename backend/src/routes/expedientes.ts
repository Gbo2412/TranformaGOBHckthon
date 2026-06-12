import { Router } from "express";
import { consultarExpediente } from "../services/expedientes.service";

export const expedientesRouter = Router();

// POST /api/expedientes/consulta { expediente, clave }
expedientesRouter.post("/consulta", async (req, res) => {
  const { expediente, clave } = req.body ?? {};
  const resultado = await consultarExpediente(expediente, clave);
  res.json(resultado);
});
