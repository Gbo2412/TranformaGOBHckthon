"use client";

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

interface Props {
  resultado: Resultado | null;
  error: string | null;
  onNuevaConsulta: () => void;
}

const COLORES_ESTADO: Record<string, string> = {
  "EN PROCESO": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "APROBADO": "bg-green-100 text-green-800 border-green-300",
  "RECHAZADO": "bg-red-100 text-red-800 border-red-300",
  "RESUELTO": "bg-green-100 text-green-800 border-green-300",
};

function badgeEstado(estado: string) {
  const clases = COLORES_ESTADO[estado] ?? "bg-gray-100 text-gray-800 border-gray-300";
  return (
    <span className={`inline-block border rounded-full px-3 py-1 text-sm font-semibold ${clases}`}>
      {estado}
    </span>
  );
}

export function ResultadoExpediente({ resultado, error, onNuevaConsulta }: Props) {
  if (error) {
    return (
      <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col gap-3">
        <p className="text-red-700 text-base">{error}</p>
        <button
          onClick={onNuevaConsulta}
          className="text-sm text-blue-700 underline text-left"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!resultado) return null;

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        {badgeEstado(resultado.estadoActual)}
        <span className="text-xs text-gray-400">Exp. {resultado.expediente}</span>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Administrado</p>
        <p className="text-base font-semibold text-gray-800">{resultado.administrado}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Trámite</p>
        <p className="text-base text-gray-800">{resultado.tramite}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Detalle del estado</p>
        <p className="text-base text-gray-700">{resultado.detalleEstado}</p>
      </div>

      <div className="flex gap-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Tiempo estimado</p>
          <p className="text-base font-medium text-gray-800">{resultado.tiempoEstimadoDias} días hábiles</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Última actualización</p>
          <p className="text-base text-gray-800">{resultado.ultimaActualizacion}</p>
        </div>
      </div>

      <button
        onClick={onNuevaConsulta}
        className="mt-2 text-sm text-blue-700 underline text-left"
      >
        Consultar otro expediente
      </button>
    </div>
  );
}