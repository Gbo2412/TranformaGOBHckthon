# PRD — Consulta de Expedientes Despacho Presidencial (MVP)

**Hackatón TRANSFORMAGOB 2026 · OGTIC DP**
Versión 1.0 — 2026-06-12
Owner: Equipo OGTIC DP · Punto focal: German Canaza Torres

---

## 1. Resumen ejecutivo

Plataforma web pública que permite a cualquier ciudadano consultar el estado de su expediente ante el Despacho Presidencial y recibir orientación sobre trámites del TUPA, 24/7, desde cualquier dispositivo con navegador, sin instalar nada.

Para el MVP de 48 horas se entrega una **web app desplegada en Vercel** que consume la **API de consulta de expedientes** provista por el Despacho Presidencial.

---

## 2. Problema

- 250 consultas/mes al Despacho Presidencial; **65% son de regiones fuera de Lima**.
- Tiempo promedio de respuesta por canal presencial: **15 días hábiles**.
- **30% de consultas son repetitivas** sobre un mismo expediente.
- Ciudadano de Puno gasta **S/350–S/700** y **2–4 días** por consulta presencial.
- Los canales actuales dependen de horarios de oficina y traslado físico.

## 3. Objetivo del MVP

Demostrar que un ciudadano puede, en **menos de 60 segundos** y desde su celular, conocer el estado real de su expediente y los próximos pasos de su trámite, sin asistencia humana.

### Métricas de éxito (post-piloto)

| Métrica | Línea base | Meta a 3 meses |
|---|---|---|
| Consultas atendidas vía web | 0 | ≥ 60% del total |
| Tiempo a respuesta (consulta de estado) | 15 días | < 1 minuto |
| Consultas presenciales repetitivas | 30% | ≤ 10% |
| NPS de ciudadanos atendidos | — | ≥ 50 |

---

## 4. Usuarios y casos de uso

### Personas

1. **Ciudadano de provincia (María, 52, Puno)** — quiere saber si su solicitud avanzó sin viajar a Lima.
2. **Trabajador urbano (Luis, 34, Lima)** — solo puede consultar fuera de horario de oficina.
3. **Adulto mayor (Don José, 68)** — necesita interfaz simple, texto grande, lenguaje claro.

### Casos de uso del MVP

| ID | Caso de uso | Prioridad |
|---|---|---|
| CU-01 | Consultar estado de expediente con número + clave | **P0** |
| CU-02 | Ver historial / línea de tiempo del expediente | **P0** |
| CU-03 | Consultar requisitos y plazos de un trámite del TUPA | **P1** |
| CU-04 | Recibir orientación vía chatbot embebido (FAQ guiada) | **P1** |
| CU-05 | Compartir el resultado de consulta (link o captura) | P2 |
| CU-06 | Suscribirse a notificaciones por correo de cambios de estado | P2 |

> Excluido del MVP: WhatsApp, app móvil nativa, login con cuenta gob.pe, descarga de constancias firmadas.

---

## 5. Alcance funcional (MVP)

### Funcionalidades In-Scope

1. **Página de inicio** con propuesta de valor y CTA de consulta.
2. **Formulario de consulta**: campos `expediente` y `clave`, validación, envío.
3. **Resultado de consulta**: estado actual, fecha última actualización, descripción del trámite, historial cronológico, próximo paso esperado.
4. **Manejo de errores**: expediente no encontrado, clave inválida, API caída, sin red.
5. **Listado de trámites TUPA** (vista estática consultable): nombre, requisitos, plazo, costo.
6. **Chatbot guiado** con flujos: consultar estado, ver requisitos, contactar mesa de partes.
7. **Accesibilidad AA**: contraste, tamaños, navegación por teclado, lector de pantalla.
8. **Responsive mobile-first** + funcionamiento en 3G.

### Out-of-Scope (MVP)

- WhatsApp / SMS / canales mensajería.
- App móvil nativa o instalable obligatoria.
- Autenticación con DNIe o cuenta gob.pe.
- Carga de documentos / inicio de nuevos trámites.
- Pasarela de pagos.
- Panel administrativo para funcionarios del DP.
- Notificaciones push.

---

## 6. Requerimientos no funcionales

| Categoría | Requerimiento |
|---|---|
| **Disponibilidad** | 99% en horario 24/7 durante el piloto. |
| **Performance** | LCP < 2.5s en 3G; respuesta de consulta < 3s p95. |
| **Accesibilidad** | WCAG 2.1 AA. |
| **Seguridad** | HTTPS obligatorio, no persistir clave del expediente en cliente, rate limiting por IP en endpoint de consulta. |
| **Privacidad** | No almacenar datos personales del ciudadano; cumplir Ley N° 29733 de Protección de Datos. |
| **Cumplimiento** | Ley de Gobierno Digital (DL 1412), alineamiento al TUPA del DP. |
| **Idioma** | Español; preparado para quechua/aimara en fase 2. |
| **Compatibilidad** | Navegadores Chrome/Safari/Edge/Firefox últimas 2 versiones; iOS 14+, Android 8+. |

---

## 7. Arquitectura técnica

### Stack

| Capa | Tecnología | Razón |
|---|---|---|
| Hosting | **Vercel** | Despliegue continuo, edge network global, HTTPS automático, gratis para el piloto. |
| Frontend | **Next.js 14** (App Router) + React 18 + TypeScript | SSR para SEO/accesibilidad, rutas dinámicas, óptimo para Vercel. |
| Estilos | **Tailwind CSS** + **shadcn/ui** | Diseño accesible y rápido de iterar. |
| API capa intermedia | **Next.js Route Handlers** (`app/api/*`) | Sin servidor adicional; corre en Vercel Functions. |
| API de expedientes | API REST provista por el DP | Fuente de verdad del estado del expediente. |
| Datos TUPA | JSON estático versionado en repo | Bajo costo, fácil de actualizar vía PR. |
| Chatbot | Motor de intents propio (JSON) sobre Next.js | Sin dependencia externa de NLP en el MVP. |
| Observabilidad | Vercel Analytics + logs de Vercel Functions | Incluido en la plataforma. |

### Diagrama lógico

```
   ┌────────────────┐
   │  Navegador     │
   │  (móvil/desk)  │
   └────────┬───────┘
            │ HTTPS
            ▼
   ┌──────────────────────────────────┐
   │  Vercel (Next.js)                │
   │  - Páginas SSR                   │
   │  - /api/expedientes/consulta     │──── HTTPS ───▶ ┌──────────────────┐
   │  - /api/tupa                     │                │ API Expedientes  │
   │  - /api/chat                     │                │ (Despacho Presid)│
   └──────────────────────────────────┘                └──────────────────┘
```

### Contratos de API

**POST `/api/expedientes/consulta`** (proxy hacia la API del DP)

Request:
```json
{ "expediente": "DP-2026-000123", "clave": "ABCD1234" }
```

Response 200:
```json
{
  "expediente": "DP-2026-000123",
  "estado": "EN TRAMITE",
  "tramite": "Solicitud de audiencia",
  "ultimaActualizacion": "2026-06-10T14:30:00Z",
  "mensaje": "Expediente derivado a la unidad de atención.",
  "historial": [
    { "fecha": "2026-06-01", "evento": "Ingreso por mesa de partes" },
    { "fecha": "2026-06-05", "evento": "Derivado a unidad de atención" }
  ],
  "proximoPaso": "Evaluación por unidad competente."
}
```

Errores: `400` (datos inválidos) · `404` (expediente no encontrado) · `401` (clave incorrecta) · `502` (API DP no disponible) · `429` (rate limit).

**GET `/api/tupa/tramites`** — listado de trámites con requisitos y plazos.

**POST `/api/chat`** — `{ mensaje, sessionId }` → respuesta del motor de intents.

### Variables de entorno (Vercel)

- `DP_API_BASE_URL` — URL de la API del Despacho Presidencial.
- `DP_API_TOKEN` — token de acceso (si aplica).
- `RATE_LIMIT_PER_MIN` — default 30.

---

## 8. Experiencia de usuario

### Flujo principal (CU-01)

1. Ciudadano entra a la URL → ve título claro y CTA "Consultar mi expediente".
2. Ingresa número de expediente y clave → presiona consultar.
3. Ve resultado: badge de estado, fecha de última actualización, línea de tiempo, próximo paso.
4. Acciones secundarias: "Consultar otro expediente", "Ver requisitos de mi trámite", "Hablar con asistente".

### Principios de diseño

- **Una acción principal por pantalla.**
- **Lenguaje claro**, cero jerga administrativa.
- **Estados de error humanos** ("No encontramos tu expediente. Verifica el número o escríbenos.").
- **Mobile-first**, tipografías ≥ 16px, botones ≥ 44px.

---

## 9. Plan de entrega (48 horas de hackatón)

| Hito | Tiempo acumulado | Entregable |
|---|---|---|
| Setup repo + Next.js + Vercel preview | +4 h | URL pública con landing. |
| Formulario + Route Handler `/api/expedientes/consulta` con mock | +12 h | Consulta end-to-end con datos JSON. |
| Integración real con API DP | +20 h | Consulta sobre datos reales del lab. |
| Vista de resultado + historial + manejo de errores | +28 h | CU-01 y CU-02 cerrados. |
| Listado TUPA + chatbot básico | +36 h | CU-03 y CU-04. |
| QA accesibilidad + responsive + pulido visual | +42 h | WCAG AA, mobile OK. |
| Demo + pitch + modelo de negocio | +48 h | Presentación final. |

---

## 10. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| API del DP no disponible durante la demo | Alto | Capa proxy con cache de respuestas y modo "datos de ejemplo". |
| Datos de prueba insuficientes | Medio | Trabajar con mock JSON paralelo del repo (`data/mock/`). |
| Latencia desde provincias | Medio | Vercel edge network + payload mínimo + SSR. |
| Confusión del ciudadano con el campo "clave" | Medio | Microcopy + ejemplo + ayuda contextual. |
| Cumplimiento de Ley de Datos Personales | Alto | No persistir datos, solo proxy; revisar con legal del DP. |

---

## 11. Métricas a instrumentar en el MVP

- N° de consultas exitosas / fallidas por día.
- Tasa de error por tipo (404, 401, 502).
- Tiempo p50/p95 de respuesta del proxy.
- Origen geográfico de los visitantes (analítica anónima).
- Tasa de uso del chatbot vs. formulario directo.

---

## 12. Post-hackatón

- Pruebas con usuarios reales coordinadas por el lab del DP.
- Iteración 2: notificaciones por correo, soporte quechua/aimara, autenticación con cuenta gob.pe.
- Iteración 3: replicar la plataforma para otras entidades del Estado (kit reutilizable).
