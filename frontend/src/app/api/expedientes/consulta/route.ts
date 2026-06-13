import { NextRequest, NextResponse } from "next/server";

const DP_API_URL =
  process.env.DP_API_BASE_URL ??
  "https://www.presidencia.gob.pe/api/consulta-expedientes/index.php";

export async function POST(req: NextRequest) {
  const { expediente, clave } = await req.json();

  if (!expediente || !clave) {
    return NextResponse.json(
      { error: "El número de expediente y la clave son requeridos." },
      { status: 400 }
    );
  }

  let dpRes: Response;
  try {
    dpRes = await fetch(DP_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ usuario: expediente, clave }),
    });
  } catch {
    return NextResponse.json(
      { error: "No pudimos conectarnos al sistema del Despacho Presidencial. Intenta en unos minutos." },
      { status: 502 }
    );
  }

  if (dpRes.status === 401) {
    return NextResponse.json(
      { error: "La clave ingresada es incorrecta. Verifica e intenta de nuevo." },
      { status: 401 }
    );
  }

  if (dpRes.status === 404) {
    return NextResponse.json(
      { error: "No encontramos tu expediente. Verifica el número o escríbenos." },
      { status: 404 }
    );
  }

  if (!dpRes.ok) {
    return NextResponse.json(
      { error: "El sistema del Despacho Presidencial no está disponible en este momento." },
      { status: 502 }
    );
  }

  const json = await dpRes.json();
  const d = json.data;

  return NextResponse.json({
    expediente: d.numero_expediente,
    tramite: d.tramite,
    administrado: d.administrado,
    estadoActual: d.estado_actual,
    detalleEstado: d.detalle_estado,
    ultimaActualizacion: d.ultima_actualizacion,
    tiempoEstimadoDias: d.tiempo_estimado_resolucion_dias,
    mensaje: json.mensaje,
  });
}