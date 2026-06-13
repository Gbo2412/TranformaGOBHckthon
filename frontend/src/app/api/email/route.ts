/* ───────────────────────────────────────────────────────────────
 *  POST /api/email
 *
 *  🚧 PENDIENTE: a cargo del colaborador.
 *
 *  Recibe { destinatario, asunto, cuerpo } y envía un correo vía
 *  servicio transaccional (ej. Resend). Variables de entorno
 *  esperadas: RESEND_API_KEY, EMAIL_FROM.
 * ─────────────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { destinatario, asunto, cuerpo } = await req.json();

  if (!destinatario || !asunto || !cuerpo) {
    return NextResponse.json(
      { error: "destinatario, asunto y cuerpo son requeridos." },
      { status: 400 }
    );
  }

  // TODO(colaborador): integrar Resend (o equivalente).
  console.log("[/api/email] stub", { destinatario, asunto });

  return NextResponse.json({
    ok: true,
    nota: "Stub — envío real pendiente de integración por el colaborador.",
  });
}
