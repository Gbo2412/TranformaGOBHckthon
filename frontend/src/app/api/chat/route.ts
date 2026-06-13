import { NextRequest, NextResponse } from "next/server";
import { runAgent, type ChatMessage } from "@/lib/agent";

export const runtime = "nodejs";

const CHIPS_MARKER = /\n*\[CHIPS:\s*([^\]]+)\]\s*$/i;

function extraerChips(texto: string): { respuesta: string; chips: string[] } {
  const match = texto.match(CHIPS_MARKER);
  if (!match) return { respuesta: texto, chips: [] };

  const respuesta = texto.replace(CHIPS_MARKER, "").trimEnd();
  const chips = match[1]
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0 && c.length <= 60);

  return { respuesta, chips };
}

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
    const { respuesta: respuestaRaw, history: nuevoHistory } = await runAgent(
      mensaje,
      history
    );
    const { respuesta, chips } = extraerChips(respuestaRaw);
    return NextResponse.json({ respuesta, chips, history: nuevoHistory });
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
