import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GMAIL_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

function correoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function base64Url(input: string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function headerSeguro(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function headerMime(value: string): string {
  const safe = headerSeguro(value);
  return /^[\x00-\x7F]*$/.test(safe)
    ? safe
    : `=?UTF-8?B?${Buffer.from(safe, "utf8").toString("base64")}?=`;
}

async function obtenerAccessToken(): Promise<string> {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Faltan GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET o GMAIL_REFRESH_TOKEN.");
  }

  const tokenRes = await fetch(GMAIL_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await tokenRes.json().catch(() => ({}));

  if (!tokenRes.ok || !data?.access_token) {
    console.error("[/api/email] Gmail token error", data);
    throw new Error("No se pudo autenticar con Gmail.");
  }

  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { destinatario, asunto, cuerpo } = await req.json();

  if (!destinatario || !asunto || !cuerpo) {
    return NextResponse.json(
      { error: "destinatario, asunto y cuerpo son requeridos." },
      { status: 400 }
    );
  }

  if (!correoValido(destinatario)) {
    return NextResponse.json(
      { error: "El correo indicado no parece válido." },
      { status: 400 }
    );
  }

  const from = process.env.EMAIL_FROM;

  if (!from) {
    return NextResponse.json(
      { error: "Falta EMAIL_FROM para enviar el correo." },
      { status: 500 }
    );
  }

  try {
    const accessToken = await obtenerAccessToken();
    const raw = base64Url(
      [
        `From: ${headerMime(from)}`,
        `To: ${headerMime(destinatario)}`,
        `Subject: ${headerMime(asunto)}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: 8bit",
        "",
        cuerpo,
      ].join("\r\n")
    );

    const gmailRes = await fetch(GMAIL_SEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    const data = await gmailRes.json().catch(() => ({}));

    if (!gmailRes.ok) {
      console.error("[/api/email] Gmail send error", data);
      return NextResponse.json(
        { error: "No se pudo enviar el correo con Gmail.", detalle: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: data?.id,
    });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "No se pudo enviar el correo.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
