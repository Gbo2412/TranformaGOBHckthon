import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompt";
import { TOOLS, ejecutarTool } from "./tools";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentResponse {
  respuesta: string;
  history: ChatMessage[];
}

const client = new Anthropic();

export async function runAgent(
  mensaje: string,
  history: ChatMessage[]
): Promise<AgentResponse> {
  const messages: Anthropic.MessageParam[] = [
    ...history.slice(-12).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user" as const, content: mensaje },
  ];

  let response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: TOOLS,
    messages,
  });

  // Loop de tool use
  while (response.stop_reason === "tool_use") {
    const toolBlock = response.content.find((b) => b.type === "tool_use");
    if (!toolBlock || toolBlock.type !== "tool_use") break;

    const resultado = await ejecutarTool(toolBlock.name, toolBlock.input);

    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolBlock.id,
          content: JSON.stringify(resultado),
        },
      ],
    });

    response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });
  }

  const textoBlock = response.content.find((b) => b.type === "text");
  const respuesta = textoBlock?.type === "text" ? textoBlock.text : "";

  const newHistory: ChatMessage[] = [
    ...history,
    { role: "user", content: mensaje },
    { role: "assistant", content: respuesta },
  ];

  return { respuesta, history: newHistory };
}