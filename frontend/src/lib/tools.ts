/* ───────────────────────────────────────────────────────────────
 *  TOOLS DEL AGENTE
 *
 *  🚧 PENDIENTE: a cargo del colaborador.
 *
 *  Define aquí las 3 tools que el agente puede invocar. Sigue el
 *  formato `tool_use` del Anthropic SDK.
 *
 *  Tool 1 — consultar_expediente
 *    input:  { expediente: string, clave: string }
 *    impl:   POST a /api/expedientes/consulta (Route Handler existente)
 *
 *  Tool 2 — obtener_tupa
 *    input:  { codigo?: string, busqueda?: string }
 *    impl:   importar `@/data/tupa.json` y filtrar.
 *
 *  Tool 3 — enviar_resultado_por_correo
 *    input:  { destinatario: string, asunto: string, cuerpo: string }
 *    impl:   POST a /api/email (a definir por el colaborador).
 * ─────────────────────────────────────────────────────────────── */

import type Anthropic from "@anthropic-ai/sdk";

export const TOOLS: Anthropic.Tool[] = [
  // TODO(colaborador): definir las 3 tools.
];

export async function ejecutarTool(
  _nombre: string,
  _input: unknown
): Promise<unknown> {
  // TODO(colaborador): switch por nombre de tool y llamar al servicio correspondiente.
  throw new Error("ejecutarTool aún no implementado");
}
