const DP_API_URL =
  process.env.DP_API_BASE_URL ??
  "https://www.presidencia.gob.pe/api/consulta-expedientes/index.php";

export async function consultarExpediente(expediente: string, clave: string) {
  const res = await fetch(DP_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ usuario: expediente, clave }),
  });

  if (!res.ok) {
    const status = res.status;
    if (status === 401) throw { code: 401, mensaje: "Clave incorrecta." };
    if (status === 404) throw { code: 404, mensaje: "Expediente no encontrado." };
    throw { code: 502, mensaje: "La API del Despacho Presidencial no está disponible." };
  }

  const json = await res.json();
  return json;
}
