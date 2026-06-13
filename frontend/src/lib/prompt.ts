/* ───────────────────────────────────────────────────────────────
 *  SYSTEM PROMPT DEL AGENTE — Despacho Presidencial
 *
 *  🚧 PENDIENTE: a cargo del colaborador.
 *
 *  Responsabilidades del agente (ver docs/PRD.md §4):
 *   - CU-01/CU-02: pedir expediente + clave, llamar a `consultar_expediente`,
 *     devolver estado en lenguaje claro.
 *   - CU-03: consultar requisitos, plazos y costos del TUPA llamando a
 *     `obtener_tupa`. NO inventar datos: si no se llamó a la tool, decir
 *     que no se tiene la información.
 *   - CU-04: orientar sobre mesa de partes, horarios y significado de
 *     cada estado.
 *   - CU-06: ofrecer envío por correo del resultado y llamar a
 *     `enviar_resultado_por_correo`.
 *
 *  Tono: cálido, claro, sin jerga administrativa. Idioma: español.
 *  Restricciones: no persistir datos, no mostrar códigos HTTP, no
 *  responder TUPA sin haber llamado la tool correspondiente.
 * ─────────────────────────────────────────────────────────────── */

export const SYSTEM_PROMPT = `[PENDIENTE — definir el system prompt del agente aquí]`;
