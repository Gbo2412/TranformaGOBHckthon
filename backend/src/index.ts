import express from "express";
import cors from "cors";
import { expedientesRouter } from "./routes/expedientes";
import { chatRouter } from "./routes/chat";
import { tupaRouter } from "./routes/tupa";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/expedientes", expedientesRouter);
app.use("/api/chat", chatRouter);
app.use("/api/tupa", tupaRouter);

const port = process.env.PORT ?? 3001;
app.listen(port, () => console.log(`API DP escuchando en :${port}`));
