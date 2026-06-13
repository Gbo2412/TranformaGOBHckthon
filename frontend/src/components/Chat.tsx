"use client";

import { useEffect, useRef, useState } from "react";
import { SystemBubble } from "./SystemBubble";

type Role = "user" | "assistant" | "system";
type Tone = "info" | "success" | "danger";

interface Message {
  role: Role;
  content: string;
  tone?: Tone;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy el asistente del Despacho Presidencial. Puedo ayudarte a consultar el estado de tu expediente, explicarte los requisitos de un trámite o enviarte el resultado por correo. ¿En qué puedo ayudarte hoy?",
};

const QUICK_REPLIES = [
  "Consultar mi expediente",
  "Requisitos de una Solicitud Simple",
  "Horarios de mesa de partes",
];

function isFirstInAssistantSequence(messages: Message[], index: number): boolean {
  if (messages[index].role !== "assistant") return false;
  if (index === 0) return true;
  return messages[index - 1].role !== "assistant";
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;

    const historyForApi = messages.filter((m) => m.role !== "system");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mensaje: content,
          history: historyForApi,
        }),
      });

      const data = await res.json();
      const reply =
        data.respuesta ??
        "Disculpa, no pude procesar tu consulta. Intenta de nuevo en un momento.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "system",
          tone: "danger",
          content: "Sin conexión. Verifica tu internet.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function retryLastUser() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) => prev.filter((m) => m.role !== "system"));
    send(lastUser.content);
  }

  return (
    <div className="flex h-full flex-col bg-surface-page">
      <header className="sticky top-0 z-10 border-b border-line bg-surface-card px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white"
          >
            <span className="text-sm font-bold">DP</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Despacho Presidencial
            </p>
            <h1 className="text-lg font-semibold text-ink-primary">
              Asistente de expedientes
            </h1>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversación con el asistente"
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m, i) => {
            if (m.role === "system") {
              return (
                <SystemBubble
                  key={i}
                  tone={m.tone ?? "info"}
                  message={m.content}
                  action={
                    m.tone === "danger"
                      ? { label: "Reintentar", onClick: retryLastUser }
                      : undefined
                  }
                />
              );
            }
            return (
              <Bubble
                key={i}
                role={m.role}
                content={m.content}
                showAvatar={isFirstInAssistantSequence(messages, i)}
              />
            );
          })}

          {pending && <TypingBubble />}

          {messages.length === 1 && (
            <div
              role="group"
              aria-label="Sugerencias rápidas"
              className="mt-2 flex flex-wrap gap-2"
            >
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="min-h-[44px] rounded-full border border-line bg-surface-muted px-4 py-2 text-sm text-ink-secondary transition hover:border-brand-700 hover:text-brand-700"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-line bg-surface-card px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <label htmlFor="chat-input" className="sr-only">
            Mensaje para el asistente
          </label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Escríbele al asistente…"
            rows={1}
            disabled={pending}
            autoComplete="off"
            className="tabular min-h-[44px] flex-1 resize-none rounded-2xl border border-line bg-surface-card px-4 py-3 text-base text-ink-primary outline-none placeholder:text-ink-muted focus:border-accent-user disabled:opacity-60"
          />
          <button
            type="submit"
            aria-label="Enviar mensaje"
            disabled={pending || !input.trim()}
            className="h-11 shrink-0 rounded-full bg-accent-user px-5 text-sm font-semibold text-white transition hover:bg-accent-userHover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-ink-muted">
          No compartas datos personales más allá de los necesarios para tu consulta.
        </p>
      </footer>
    </div>
  );
}

function Bubble({
  role,
  content,
  showAvatar,
}: {
  role: "user" | "assistant";
  content: string;
  showAvatar: boolean;
}) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          aria-label="Tu mensaje"
          className="tabular max-w-[85%] whitespace-pre-wrap rounded-bubble rounded-br-md bg-accent-user px-4 py-3 text-base text-white"
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white ${
          showAvatar ? "" : "invisible"
        }`}
      >
        DP
      </div>
      <div
        aria-label="Mensaje del asistente"
        className="tabular max-w-[85%] whitespace-pre-wrap rounded-bubble rounded-bl-md border border-line bg-surface-card px-4 py-3 text-base text-ink-primary shadow-sm"
      >
        {content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div
      aria-live="polite"
      aria-label="El asistente está escribiendo"
      className="flex items-end gap-2"
    >
      <div
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white"
      >
        DP
      </div>
      <div className="flex max-w-[85%] items-center gap-1 rounded-bubble rounded-bl-md border border-line bg-surface-card px-4 py-3 shadow-sm">
        <Dot />
        <Dot delay="0.15s" />
        <Dot delay="0.3s" />
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-ink-muted"
      style={{ animationDelay: delay }}
    />
  );
}
