"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Mensaje {
  de: "usuario" | "bot";
  texto: string;
  opciones?: { label: string; valor: string }[];
}

interface FlujoConsulta {
  paso: "esperando_numero" | "esperando_clave" | null;
  expediente: string | null;
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
  const [flujo, setFlujo] = useState<FlujoConsulta>({ paso: null, expediente: null });
  const [ultimoEstado, setUltimoEstado] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  function agregarMensajeBot(texto: string, opciones?: Mensaje["opciones"]) {
    setMensajes((prev) => [...prev, { de: "bot", texto, opciones }]);
  }

  function agregarMensajeUsuario(texto: string) {
    setMensajes((prev) => [...prev, { de: "usuario", texto }]);
  }

  async function enviar(texto: string) {
    if (!texto.trim() || cargando) return;
    setInput("");

    // Flujo de consulta de expediente
    if (flujo.paso === "esperando_numero") {
      const formatoValido = /^\d{4}-\d{5,8}$/.test(texto.trim());
      agregarMensajeUsuario(texto);
      if (!formatoValido) {
        agregarMensajeBot("El formato no es válido. Ingresa el número tal como aparece en tu comprobante, por ejemplo: 2026-0010582");
        return;
      }
      setCargando(true);
      try {
        const res = await fetch("/api/expedientes/consulta", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ expediente: texto.trim(), clave: "0" }),
        });
        if (res.status === 401) {
          setFlujo({ paso: "esperando_clave", expediente: texto.trim() });
          agregarMensajeBot("Expediente encontrado. Ahora ingresa tu clave de acceso:");
        } else if (res.status === 404) {
          agregarMensajeBot(
            `No encontramos el expediente ${texto.trim()}. Verifica el número o acércate a mesa de partes.`,
            [{ label: "Contactar mesa de partes", valor: "mesa_partes" }]
          );
        } else {
          agregarMensajeBot("No pudimos verificar el expediente en este momento. Intenta de nuevo.");
        }
      } catch {
        agregarMensajeBot("Hubo un problema de conexión. Intenta de nuevo en un momento.");
      } finally {
        setCargando(false);
      }
      return;
    }

    if (flujo.paso === "esperando_clave") {
      const claveValida = /^\d+$/.test(texto.trim());
      agregarMensajeUsuario(texto);
      if (!claveValida) {
        agregarMensajeBot("La clave debe contener solo números. Inténtalo de nuevo:");
        return;
      }
      setCargando(true);
      try {
        const res = await fetch("/api/expedientes/consulta", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ expediente: flujo.expediente, clave: texto.trim() }),
        });
        const data = await res.json();

        if (data.error) {
          agregarMensajeBot(
            `No encontramos tu expediente. Verifica el número (${flujo.expediente}) y la clave, o acércate a mesa de partes.`,
            [{ label: "Contactar mesa de partes", valor: "mesa_partes" }]
          );
        } else {
          setUltimoEstado(data.estadoActual);
          agregarMensajeBot(
            `Expediente ${data.expediente}\n\nTrámite: ${data.tramite}\nTitular: ${data.administrado}\nEstado: ${data.estadoActual}\nDetalle: ${data.detalleEstado}\nÚltima actualización: ${data.ultimaActualizacion}`,
            [
              { label: `¿Qué significa "${data.estadoActual}"?`, valor: "explicar_estado" },
              { label: "Consultar otro expediente", valor: "consultar_estado" },
            ]
          );
        }
      } catch {
        agregarMensajeBot("Hubo un problema al consultar. Intenta de nuevo en un momento.");
      } finally {
        setCargando(false);
        setFlujo({ paso: null, expediente: null });
      }
      return;
    }

    // Flujo general — chatbot por keywords
    agregarMensajeUsuario(texto);
    setCargando(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensaje: texto }),
      });
      const data = await res.json();
      agregarMensajeBot(data.texto, data.opciones);
    } catch {
      agregarMensajeBot("Hubo un problema. Intenta de nuevo en un momento.");
    } finally {
      setCargando(false);
    }
  }

  function handleOpcion(valor: string, label: string) {
    if (valor === "__link_inicio" || valor === "__link_tupa") return;

    if (valor === "consultar_estado") {
      agregarMensajeUsuario(label);
      setFlujo({ paso: "esperando_numero", expediente: null });
      agregarMensajeBot("Por favor, ingresa tu número de expediente (Ej: 2026-0001234):");
      return;
    }

    if (valor === "explicar_estado") {
      const explicaciones: Record<string, string> = {
        "DOCUMENTO REGISTRADO": "Tu solicitud fue recibida correctamente en el sistema y está en cola para ser asignada a un funcionario que la revisará.",
        "EN PROCESO": "Un funcionario está revisando tu caso actualmente. Recibirás una respuesta dentro del plazo establecido según el tipo de trámite.",
        "SE EMITIÓ RESPUESTA": "Ya se generó una respuesta oficial a tu solicitud. Si no la recibiste, acércate a mesa de partes o escribe a accesoinf@presidencia.gob.pe.",
      };
      const explicacion = ultimoEstado
        ? (explicaciones[ultimoEstado] ?? `El estado "${ultimoEstado}" indica que tu expediente está siendo gestionado. Contáctanos si necesitas más detalles.`)
        : "No tengo información del estado en este momento.";
      agregarMensajeUsuario(label);
      agregarMensajeBot(explicacion, [
        { label: "Consultar otro expediente", valor: "consultar_estado" },
        { label: "Contactar mesa de partes", valor: "mesa_partes" },
      ]);
      return;
    }

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
                  Consultando...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Cancelar flujo */}
          {flujo.paso && (
            <div className="px-3 pt-2 flex justify-end border-t border-gray-100">
              <button
                onClick={() => {
                  setFlujo({ paso: null, expediente: null });
                  agregarMensajeBot("Consulta cancelada. ¿En qué más puedo ayudarte?", [
                    { label: "Consultar mi expediente", valor: "consultar_estado" },
                    { label: "Ver trámites del TUPA", valor: "__link_tupa" },
                  ]);
                }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Cancelar consulta
              </button>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); enviar(input); }}
            className={`px-3 py-2 flex gap-2 ${!flujo.paso ? "border-t border-gray-100" : ""}`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                flujo.paso === "esperando_numero"
                  ? "Ej: 2026-0001234"
                  : flujo.paso === "esperando_clave"
                  ? "Ej: 1234"
                  : "Escribe tu consulta..."
              }
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