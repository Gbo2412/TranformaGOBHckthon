import type Anthropic from "@anthropic-ai/sdk";

const DP_API_URL =
  process.env.DP_API_BASE_URL ??
  "https://www.presidencia.gob.pe/api/consulta-expedientes/index.php";

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "consultar_expediente",
    description:
      "Consulta el estado de un expediente en el sistema del Despacho Presidencial. Usa esta herramienta cuando el ciudadano proporcione su número de expediente y su clave.",
    input_schema: {
      type: "object" as const,
      properties: {
        expediente: {
          type: "string",
          description: "Número de expediente (formato: YYYY-NNNNNNN, ej: 2026-0001234)",
        },
        clave: {
          type: "string",
          description: "Clave numérica de acceso al expediente",
        },
      },
      required: ["expediente", "clave"],
    },
  },
  {
    name: "enviar_resultado_por_correo",
    description:
      "Envía al ciudadano el resumen del estado de su expediente por correo electrónico. Úsala SOLO después de haber consultado un expediente exitosamente Y de que el ciudadano haya aceptado recibir el resultado por correo Y de haber confirmado su dirección de correo.",
    input_schema: {
      type: "object" as const,
      properties: {
        destinatario: {
          type: "string",
          description: "Dirección de correo del ciudadano (validar formato básico).",
        },
        asunto: {
          type: "string",
          description:
            "Asunto del correo, ej: 'Estado de tu expediente 2026-0010582 — Despacho Presidencial'.",
        },
        cuerpo: {
          type: "string",
          description:
            "Cuerpo del correo en texto plano: estado, trámite, administrado, detalle, última actualización y tiempo estimado en días hábiles.",
        },
      },
      required: ["destinatario", "asunto", "cuerpo"],
    },
  },
];

async function consultarExpediente(expediente: string, clave: string): Promise<unknown> {
  try {
    const res = await fetch(DP_API_URL, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify({ usuario: expediente, clave }),
    });

    if (res.status === 401) {
      return { error: "La clave ingresada no corresponde a ese expediente." };
    }
    if (res.status === 404) {
      return { error: `El expediente ${expediente} no fue encontrado en el sistema.` };
    }
    if (!res.ok) {
      return { error: "Error de conexión al consultar el expediente." };
    }

    const json = await res.json();
    const d = json.data;
    return {
      expediente: d.numero_expediente,
      tramite: d.tramite,
      administrado: d.administrado,
      estadoActual: d.estado_actual,
      detalleEstado: d.detalle_estado,
      ultimaActualizacion: d.ultima_actualizacion,
      tiempoEstimadoDias: d.tiempo_estimado_resolucion_dias,
    };
  } catch {
    return { error: "Error de conexión al consultar el expediente." };
  }
}

function correoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

async function enviarResultadoPorCorreo(
  destinatario: string,
  asunto: string,
  cuerpo: string
): Promise<unknown> {
  if (!correoValido(destinatario)) {
    return { error: "El correo indicado no parece válido. Pídele al ciudadano que lo verifique." };
  }
  // TODO(colaborador): integrar Resend en /api/email y consumirlo desde aquí.
  // Por ahora se simula envío exitoso para que el flujo del agente quede armado.
  console.log("[tool enviar_resultado_por_correo] stub", { destinatario, asunto });
  return {
    ok: true,
    mensaje: `Correo enviado a ${destinatario}.`,
    cuerpoPreview: cuerpo.slice(0, 60),
  };
}

export async function ejecutarTool(nombre: string, input: unknown): Promise<unknown> {
  const i = input as Record<string, string>;
  switch (nombre) {
    case "consultar_expediente":
      return consultarExpediente(i.expediente, i.clave);
    case "enviar_resultado_por_correo":
      return enviarResultadoPorCorreo(i.destinatario, i.asunto, i.cuerpo);
    default:
      return { error: `Herramienta desconocida: ${nombre}` };
  }
}
