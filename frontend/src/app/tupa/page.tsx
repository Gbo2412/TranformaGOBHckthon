import Link from "next/link";

interface Tramite {
  codigo: string;
  nombre: string;
  descripcion: string;
  requisitos: string[];
  plazo: string;
  costo: string;
  canal: string;
  base_legal?: string;
  silencio_administrativo?: string;
}

async function getTramites(): Promise<Tramite[]> {
  const res = await fetch("http://localhost:3000/api/tupa", { cache: "no-store" });
  const data = await res.json();
  return data.tramites;
}

export default async function TupaPage() {
  const tramites = await getTramites();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-sm text-blue-700 hover:underline">
            ← Volver al inicio
          </Link>
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Despacho Presidencial
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Trámites del TUPA</h1>
          <p className="text-base text-gray-500">
            Consulta los requisitos, plazos y costos de los trámites disponibles.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {tramites.map((t) => (
            <div
              key={t.codigo}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-gray-400">{t.codigo}</span>
                  <h2 className="text-xl font-semibold text-gray-900">{t.nombre}</h2>
                </div>
                <span className="shrink-0 bg-green-100 text-green-800 border border-green-200 text-xs font-semibold px-2 py-1 rounded-full">
                  {t.costo}
                </span>
              </div>

              <p className="text-base text-gray-600">{t.descripcion}</p>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Requisitos</p>
                <ul className="flex flex-col gap-1">
                  {t.requisitos.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Plazo</p>
                  <p className="text-sm font-medium text-gray-800">{t.plazo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Canal</p>
                  <p className="text-sm text-gray-800">{t.canal}</p>
                </div>
                {t.silencio_administrativo && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Silencio administrativo</p>
                    <p className="text-sm text-gray-800">{t.silencio_administrativo}</p>
                  </div>
                )}
              </div>

              {t.base_legal && (
                <p className="text-xs text-gray-400">Base legal: {t.base_legal}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}