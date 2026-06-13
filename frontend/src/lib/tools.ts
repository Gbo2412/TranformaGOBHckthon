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

export async function ejecutarTool(nombre: string, input: unknown): Promise<unknown> {
  const i = input as Record<string, string>;
  switch (nombre) {
    case "consultar_expediente":
      return consultarExpediente(i.expediente, i.clave);
    default:
      return { error: `Herramienta desconocida: ${nombre}` };
  }
}