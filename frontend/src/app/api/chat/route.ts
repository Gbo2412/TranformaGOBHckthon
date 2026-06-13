import { NextRequest, NextResponse } from "next/server";

interface Respuesta {
  texto: string;
  opciones?: { label: string; valor: string }[];
}

function detectarIntent(mensaje: string): string {
  const m = mensaje.toLowerCase();

  if (/hola|buenos|buenas|hi|saludos/.test(m)) return "saludo";
  if (/estado|expediente|tramite|como va|consultar|numero|avanzó|saber/.test(m)) return "consultar_estado";
  if (/requisito|documento|necesito|presentar|solicitud|que piden/.test(m)) return "requisitos_tramite";
  if (/mesa de partes|contacto|dirección|donde|presencial|oficina/.test(m)) return "mesa_partes";
  if (/plazo|tiempo|demora|cuanto tarda|dias/.test(m)) return "plazos";
  if (/horario|atienden|abierto|hora|cuando abren|cuando cierran/.test(m)) return "horarios";
  if (/no tengo clave|olvide|olvidé|perdí|perdi|recuperar|no recuerdo/.test(m)) return "recuperar_clave";
  if (/que significa|qué significa|quiere decir|en proceso|emitió|emitio|respuesta|registrado/.test(m)) return "significado_estado";

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
    texto: "Para consultar tu expediente necesitas tu número (Ej: 2026-0001234) y tu clave numérica. Los recibes al momento de presentar tu solicitud.",
    opciones: [{ label: "Consultar aquí en el chat", valor: "consultar_estado" }],
  },
  requisitos_tramite: {
    texto: "Tenemos 3 trámites disponibles: Solicitud Simple, Acceso a la Información Pública (SAIP) y Reclamo. Puedes ver los requisitos completos en la página de trámites.",
    opciones: [{ label: "Ver trámites del TUPA", valor: "__link_tupa" }],
  },
  mesa_partes: {
    texto: "Mesa de Partes del Despacho Presidencial:\nJr. de la Unión N° 264, Edificio Palacio, Cercado de Lima.\naccesoinf@presidencia.gob.pe\nHorario: lunes a viernes 8:30 am – 4:30 pm",
    opciones: [{ label: "Ver trámites disponibles", valor: "requisitos_tramite" }],
  },
  plazos: {
    texto: "Los plazos de atención son:\n• Solicitud Simple: 30 días hábiles\n• Acceso a la Información Pública: 10 días hábiles\n• Reclamo: 30 días hábiles",
    opciones: [{ label: "Ver requisitos de cada trámite", valor: "requisitos_tramite" }],
  },
  horarios: {
    texto: "La Mesa de Partes atiende de lunes a viernes de 8:30 am a 4:30 pm en Jr. de la Unión N° 264, Edificio Palacio, Cercado de Lima.",
    opciones: [{ label: "Contactar mesa de partes", valor: "mesa_partes" }],
  },
  recuperar_clave: {
    texto: "Si no recuerdas tu clave, puedes solicitarla presentándote en la Mesa de Partes con tu DNI y el número de expediente. También puedes escribir a accesoinf@presidencia.gob.pe indicando tu nombre completo y número de expediente.",
    opciones: [{ label: "Contactar mesa de partes", valor: "mesa_partes" }],
  },
  significado_estado: {
    texto: "Los estados de tu expediente significan:\n• Documento Registrado: recibimos tu solicitud y está en cola de atención.\n• En Proceso: un funcionario está revisando tu caso.\n• Se Emitió Respuesta: ya enviamos una respuesta; si no la recibiste, contáctanos.",
    opciones: [
      { label: "Consultar mi expediente", valor: "consultar_estado" },
      { label: "Contactar mesa de partes", valor: "mesa_partes" },
    ],
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