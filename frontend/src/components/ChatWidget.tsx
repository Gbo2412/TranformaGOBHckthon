"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Mensaje {
  de: "usuario" | "bot";
  texto: string;
  opciones?: { label: string; valor: string }[];
}

const BIENVENIDA: Mensaje = {
  de: "bot",
  texto: "¡Hola! Soy el asistente del Despacho Presidencial. ¿En qué puedo ayudarte?",
  opciones: [
    { label: "Consultar mi expediente", valor: "consultar_estado" },
    { label: "Ver requisitos de un trámite", valor: "requisitos_tramite" },
    { label: "Contactar mesa de partes", valor: "mesa_partes" },
  ],
};

export function ChatWidget() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function enviar(texto: string) {
    if (!texto.trim() || cargando) return;

    const nuevoMensaje: Mensaje = { de: "usuario", texto };
    setMensajes((prev) => [...prev, nuevoMensaje]);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensaje: texto }),
      });
      const data = await res.json();
      setMensajes((prev) => [...prev, { de: "bot", texto: data.texto, opciones: data.opciones }]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        { de: "bot", texto: "Hubo un problema. Intenta de nuevo en un momento." },
      ]);
    } finally {
      setCargando(false);
    }
  }

  function handleOpcion(valor: string, label: string) {
    if (valor === "__link_inicio" || valor === "__link_tupa") return;
    enviar(label);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {abierto && (
        <div className="w-80 bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">Asistente DP</p>
              <p className="text-blue-200 text-xs">Despacho Presidencial</p>
            </div>
            <button onClick={() => setAbierto(false)} className="text-white text-lg leading-none">
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-80">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex flex-col gap-2 ${m.de === "usuario" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-3 py-2 rounded-xl text-sm max-w-[90%] whitespace-pre-line ${
                    m.de === "usuario"
                      ? "bg-blue-700 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {m.texto}
                </div>
                {m.opciones && m.de === "bot" && (
                  <div className="flex flex-wrap gap-1 max-w-[90%]">
                    {m.opciones.map((op) =>
                      op.valor === "__link_inicio" ? (
                        <Link
                          key={op.valor}
                          href="/"
                          className="text-xs border border-blue-600 text-blue-700 rounded-full px-3 py-1 hover:bg-blue-50"
                        >
                          {op.label}
                        </Link>
                      ) : op.valor === "__link_tupa" ? (
                        <Link
                          key={op.valor}
                          href="/tupa"
                          className="text-xs border border-blue-600 text-blue-700 rounded-full px-3 py-1 hover:bg-blue-50"
                        >
                          {op.label}
                        </Link>
                      ) : (
                        <button
                          key={op.valor}
                          onClick={() => handleOpcion(op.valor, op.label)}
                          className="text-xs border border-blue-600 text-blue-700 rounded-full px-3 py-1 hover:bg-blue-50"
                        >
                          {op.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
            {cargando && (
              <div className="flex items-start">
                <div className="bg-gray-100 text-gray-500 text-sm px-3 py-2 rounded-xl rounded-bl-none">
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); enviar(input); }}
            className="border-t border-gray-100 px-3 py-2 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || cargando}
              className="bg-blue-700 disabled:opacity-50 text-white text-sm rounded-full px-4 py-2"
            >
              →
            </button>
          </form>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setAbierto((v) => !v)}
        className="bg-blue-700 hover:bg-blue-800 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors"
        aria-label="Abrir asistente"
      >
        {abierto ? "✕" : "💬"}
      </button>
    </div>
  );
}