"use client";

import { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy el asistente del Despacho Presidencial. Puedo ayudarte a consultar el estado de tu expediente, explicarte los requisitos de un trámite o enviarte el resultado por correo. ¿En qué puedo ayudarte hoy?",
};

const QUICK_REPLIES = [
  "Consultar mi expediente",
  "¿Qué necesito para una Solicitud Simple?",
  "Horarios de mesa de partes",
];

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
          history: next.slice(0, -1),
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
          role: "assistant",
          content:
            "Tuvimos un problema de conexión. Verifica tu internet e intenta de nuevo.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
            <span className="text-sm font-bold">DP</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Despacho Presidencial
            </p>
            <h1 className="text-base font-semibold text-slate-900">
              Asistente de expedientes
            </h1>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        aria-live="polite"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}

          {pending && <TypingBubble />}

          {messages.length === 1 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-brand hover:text-brand"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <label htmlFor="chat-input" className="sr-only">
            Mensaje
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
            className="min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="h-11 shrink-0 rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-slate-400">
          No compartas datos personales más allá de los necesarios para tu consulta.
        </p>
      </footer>
    </div>
  );
}

function Bubble({ role, content }: { role: Role; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand px-4 py-3 text-base text-white"
            : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 shadow-sm"
        }
      >
        {content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
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
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-400"
      style={{ animationDelay: delay }}
    />
  );
}
