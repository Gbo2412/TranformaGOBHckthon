"use client";

import { useState } from "react";

interface ResultadoExpediente {
  expediente: string;
  tramite: string;
  administrado: string;
  estadoActual: string;
  detalleEstado: string;
  ultimaActualizacion: string;
  tiempoEstimadoDias: number;
  mensaje: string;
}

interface Props {
  onResultado: (resultado: ResultadoExpediente | null, error: string | null) => void;
}

export function ConsultaForm({ onResultado }: Props) {
  const [expediente, setExpediente] = useState("");
  const [clave, setClave] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!expediente.trim() || !clave.trim()) return;

    setCargando(true);
    onResultado(null, null);

    try {
      const res = await fetch("/api/expedientes/consulta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expediente: expediente.trim(), clave: clave.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        onResultado(null, data.error ?? "Ocurrió un error inesperado.");
      } else {
        onResultado(data, null);
      }
    } catch {
      onResultado(null, "No hay conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="expediente" className="text-sm font-medium text-gray-700">
          Número de expediente
        </label>
        <input
          id="expediente"
          type="text"
          placeholder="Ej: 2026-0001234"
          value={expediente}
          onChange={(e) => setExpediente(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="clave" className="text-sm font-medium text-gray-700">
          Clave
        </label>
        <input
          id="clave"
          type="text"
          placeholder="Ej: 1234"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold text-base rounded-lg px-4 py-3 transition-colors"
      >
        {cargando ? "Consultando..." : "Consultar mi expediente"}
      </button>
    </form>
  );
}