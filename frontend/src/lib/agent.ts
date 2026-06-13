/* ───────────────────────────────────────────────────────────────
 *  LOOP DEL AGENTE
 *
 *  🚧 PENDIENTE: a cargo del colaborador.
 *
 *  Recibe `mensaje` + `history` y devuelve la respuesta del agente.
 *  Implementación esperada:
 *    1. Llamar a Claude con SYSTEM_PROMPT, history y mensaje del usuario.
 *    2. Si la respuesta contiene `tool_use`, ejecutar `ejecutarTool` y
 *       volver a llamar al modelo con el `tool_result`.
 *    3. Repetir hasta que el modelo devuelva texto final.
 *    4. Devolver `{ respuesta, history }`.
 * ─────────────────────────────────────────────────────────────── */

import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompt";
import { TOOLS } from "./tools";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentResponse {
  respuesta: string;
  history: ChatMessage[];
}

export async function runAgent(
  _mensaje: string,
  _history: ChatMessage[]
): Promise<AgentResponse> {
  // TODO(colaborador): implementar el loop de tool use con Claude.
  void new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  void SYSTEM_PROMPT;
  void TOOLS;

  return {
    respuesta:
      "(Agente aún no conectado) Esta es una respuesta de placeholder. El colaborador implementará el loop en `lib/agent.ts`.",
    history: [],
  };
}
