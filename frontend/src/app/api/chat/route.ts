import { NextRequest, NextResponse } from "next/server";
import { runAgent, type ChatMessage } from "@/lib/agent";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const mensaje: string = body?.mensaje?.trim?.() ?? "";
  const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

  if (!mensaje) {
    return NextResponse.json(
      { error: "El mensaje es requerido." },
      { status: 400 }
    );
  }

  try {
    const { respuesta, history: nuevoHistory } = await runAgent(mensaje, history);
    return NextResponse.json({ respuesta, history: nuevoHistory });
  } catch (err) {
    console.error("[/api/chat] error", err);
    return NextResponse.json(
      {
        error:
          "Tuvimos un problema procesando tu mensaje. Intenta de nuevo en un momento.",
      },
      { status: 500 }
    );
  }
}
