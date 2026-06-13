import { NextRequest, NextResponse } from "next/server";

interface Respuesta {
  texto: string;
  opciones?: { label: string; valor: string }[];
  accion?: { tipo: "link"; href: string };
}

function detectarIntent(mensaje: string): string {
  const m = mensaje.toLowerCase();

  if (/hola|buenos|buenas|hi|saludos/.test(m)) return "saludo";
  if (/estado|expediente|tramite|como va|consultar|numero|avanzó|saber/.test(m)) return "consultar_estado";
  if (/requisito|documento|necesito|presentar|solicitud|que piden/.test(m)) return "requisitos_tramite";
  if (/mesa de partes|contacto|dirección|donde|presencial|oficina/.test(m)) return "mesa_partes";
  if (/plazo|tiempo|demora|cuanto tarda|dias/.test(m)) return "plazos";

  return "desconocido";
}

const RESPUESTAS: Record<string, Respuesta> = {
  saludo: {
    texto: "¡Hola! Soy el asistente del Despacho Presidencial. Puedo ayudarte a consultar tu expediente o informarte sobre los trámites disponibles. ¿Qué necesitas?",
    opciones: [
      { label: "Consultar mi expediente", valor: "consultar_estado" },
      { label: "Ver requisitos de un trámite", valor: "requisitos_tramite" },
      { label: "Contactar mesa de partes", valor: "mesa_partes" },
    ],
  },
  consultar_estado: {
    texto: "Para consultar tu expediente necesitas tu número de expediente (Ej: 2026-0010582) y tu clave (Ej: 4176). Puedes ingresarlos directamente en el formulario de la página principal.",
    opciones: [{ label: "Ir al formulario", valor: "__link_inicio" }],
  },
  requisitos_tramite: {
    texto: "Tenemos 3 trámites disponibles: Solicitud Simple, Acceso a la Información Pública (SAIP) y Reclamo. Puedes ver los requisitos completos de cada uno en la página de trámites.",
    opciones: [{ label: "Ver trámites del TUPA", valor: "__link_tupa" }],
  },
  mesa_partes: {
    texto: "Puedes presentar tu solicitud en la Mesa de Partes del Despacho Presidencial:\nJr. de la Unión N° 264, Edificio Palacio, Cercado de Lima.\naccesoinf@presidencia.gob.pe",
    opciones: [{ label: "Ver trámites disponibles", valor: "requisitos_tramite" }],
  },
  plazos: {
    texto: "Los plazos de atención son:\n• Solicitud Simple: 30 días hábiles\n• Acceso a la Información Pública: 10 días hábiles\n• Reclamo: 30 días hábiles",
    opciones: [{ label: "Ver requisitos de cada trámite", valor: "requisitos_tramite" }],
  },
  desconocido: {
    texto: "No entendí bien tu consulta. Puedo ayudarte con estos temas:",
    opciones: [
      { label: "Consultar mi expediente", valor: "consultar_estado" },
      { label: "Ver requisitos de un trámite", valor: "requisitos_tramite" },
      { label: "Contactar mesa de partes", valor: "mesa_partes" },
    ],
  },
};

export async function POST(req: NextRequest) {
  const { mensaje } = await req.json();
  if (!mensaje) {
    return NextResponse.json({ error: "Mensaje requerido." }, { status: 400 });
  }

  const intent = mensaje in RESPUESTAS ? mensaje : detectarIntent(mensaje);
  const respuesta = RESPUESTAS[intent];

  return NextResponse.json(respuesta);
}