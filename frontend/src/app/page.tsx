"use client";

import { useState } from "react";
import Link from "next/link";
import { ConsultaForm } from "@/components/ConsultaForm";
import { ResultadoExpediente } from "@/components/ResultadoExpediente";
import { ChatWidget } from "@/components/ChatWidget";

interface Resultado {
  expediente: string;
  tramite: string;
  administrado: string;
  estadoActual: string;
  detalleEstado: string;
  ultimaActualizacion: string;
  tiempoEstimadoDias: number;
  mensaje: string;
}

export default function Home() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consultado, setConsultado] = useState(false);

  function handleResultado(r: Resultado | null, e: string | null) {
    setResultado(r);
    setError(e);
    setConsultado(true);
  }

  function handleNuevaConsulta() {
    setResultado(null);
    setError(null);
    setConsultado(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-center flex flex-col gap-2">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Despacho Presidencial
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Consulta tu expediente
          </h1>
          <p className="text-base text-gray-500">
            Conoce el estado de tu trámite las 24 horas, desde cualquier lugar.
          </p>
        </div>

        {!consultado && (
          <ConsultaForm onResultado={handleResultado} />
        )}

        {consultado && (
          <ResultadoExpediente
            resultado={resultado}
            error={error}
            onNuevaConsulta={handleNuevaConsulta}
          />
        )}

        <Link
          href="/tupa"
          className="text-sm text-blue-700 hover:underline"
        >
          Ver trámites del TUPA →
        </Link>
      </div>
      <ChatWidget />
    </main>
  );
}