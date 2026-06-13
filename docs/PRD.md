# PRD — Consulta de Expedientes Despacho Presidencial (MVP)

**Hackatón TRANSFORMAGOB 2026 · OGTIC DP**
Versión 1.1 — 2026-06-12
Owner: Equipo OGTIC DP · Punto focal: German Canaza Torres

---

## 1. Resumen ejecutivo

Plataforma web pública que permite a cualquier ciudadano consultar el estado de su expediente ante el Despacho Presidencial y recibir orientación sobre trámites del TUPA, 24/7, desde cualquier dispositivo con navegador, sin instalar nada.

Para el MVP de 48 horas se entrega una **web app desplegada en Vercel** (Next.js full-stack) que consume la **API de consulta de expedientes** provista por el Despacho Presidencial.

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
| CU-02 | Ver detalle del estado, tiempo estimado de resolución y nombre del administrado | **P0** |
| CU-03 | Consultar requisitos y plazos de un trámite del TUPA | **P1** |
| CU-04 | Recibir orientación vía chatbot embebido (FAQ guiada) | **P1** |
| CU-05 | Compartir el resultado de consulta (link o captura) | P2 |
| CU-06 | Suscribirse a notificaciones por correo de cambios de estado | P2 |

> Excluido del MVP: WhatsApp, app móvil nativa, login con cuenta gob.pe, descarga de constancias firmadas, historial cronológico de eventos (la API del DP no lo provee en esta versión).

---

## 5. Alcance funcional (MVP)

### Funcionalidades In-Scope

1. **Página de inicio** con propuesta de valor y CTA de consulta.
2. **Formulario de consulta**: campos `número de expediente` y `clave`, validación, envío.
3. **Resultado de consulta**: estado actual (badge), nombre del administrado, descripción del trámite, detalle del estado, tiempo estimado de resolución, fecha de última actualización.
4. **Manejo de errores**: expediente no encontrado, clave inválida, API caída, sin red.
5. **Listado de trámites TUPA** (vista estática consultable): nombre, requisitos, plazo, costo, canal de atención.
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
- Historial cronológico de eventos (no disponible en API actual del DP).

---

## 6. Requerimientos no funcionales

| Categoría | Requerimiento |
|---|---|
| **Disponibilidad** | 99% en horario 24/7 durante el piloto. |
| **Performance** | LCP < 2.5s en 3G; respuesta de consulta < 3s p95. |
| **Accesibilidad** | WCAG 2.1 AA. |
| **Seguridad** | HTTPS obligatorio, no persistir clave del expediente en cliente, rate limiting por IP en Route Handler de consulta. |
| **Privacidad** | No almacenar datos personales del ciudadano; cumplir Ley N° 29733 de Protección de Datos. |
| **Cumplimiento** | Ley de Gobierno Digital (DL 1412), alineamiento al TUPA del DP (DS N° 062-2010-PCM mod. por RM N° 272-2017-PCM). |
| **Idioma** | Español; preparado para quechua/aimara en fase 2. |
| **Compatibilidad** | Navegadores Chrome/Safari/Edge/Firefox últimas 2 versiones; iOS 14+, Android 8+. |

---

## 7. Arquitectura técnica

### Stack

| Capa | Tecnología | Razón |
|---|---|---|
| Hosting | **Vercel** | Despliegue continuo, edge network global, HTTPS automático, gratis para el piloto. |
| Frontend + API | **Next.js 14** (App Router) + React 18 + TypeScript | Full-stack en un solo repo; Route Handlers reemplazan servidor Express; óptimo para Vercel. |
| Estilos | **Tailwind CSS** + **shadcn/ui** | Diseño accesible y rápido de iterar. |
| API de expedientes | API REST provista por el DP (`POST https://www.presidencia.gob.pe/api/consulta-expedientes/index.php`) | Fuente de verdad del estado del expediente. |
| Datos TUPA | JSON estático versionado en repo (`data/mock/tupa.json`) | Bajo costo, fácil de actualizar vía PR. |
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
   │  Vercel (Next.js full-stack)     │
   │  - Páginas SSR                   │
   │  - /api/expedientes/consulta     │──── HTTPS ───▶ ┌──────────────────────────────┐
   │  - /api/tupa                     │                │ API Expedientes DP           │
   │  - /api/chat                     │                │ presidencia.gob.pe           │
   └──────────────────────────────────┘                └──────────────────────────────┘
```

### Contratos de API

**POST `/api/expedientes/consulta`** (Route Handler — proxy hacia la API del DP)

Request:
```json
{ "expediente": "2026-0010582", "clave": "4176" }
```

Internamente llama a la API del DP con `{ "usuario": "<expediente>", "clave": "<clave>" }`.

Response 200 (mapeado desde la respuesta del DP):
```json
{
  "expediente": "2026-0010582",
  "tramite": "Solicitud de Audiencia Presidencial",
  "administrado": "QUISPE MAMANI ROSA ELENA",
  "estadoActual": "EN PROCESO",
  "detalleEstado": "Su expediente se encuentra en proceso de evaluación por el área correspondiente.",
  "ultimaActualizacion": "2026-06-13 01:04:35",
  "tiempoEstimadoDias": 5,
  "mensaje": "Consulta procesada exitosamente."
}
```

Errores: `400` (datos inválidos) · `404` (expediente no encontrado) · `401` (clave incorrecta) · `502` (API DP no disponible) · `429` (rate limit).

**GET `/api/tupa`** — listado de trámites del TUPA con requisitos, plazos, costos y canales.

**POST `/api/chat`** — `{ mensaje, sessionId }` → respuesta del motor de intents.

### Variables de entorno (Vercel)

- `DP_API_BASE_URL` — URL de la API del DP (default: `https://www.presidencia.gob.pe/api/consulta-expedientes/index.php`).
- `RATE_LIMIT_PER_MIN` — default 30.

---

## 8. Experiencia de usuario

### Flujo principal (CU-01 + CU-02)

1. Ciudadano entra a la URL → ve título claro y CTA "Consultar mi expediente".
2. Ingresa número de expediente y clave → presiona consultar.
3. Ve resultado: badge de estado, nombre del administrado, trámite, detalle del estado, tiempo estimado de resolución, fecha de última actualización.
4. Acciones secundarias: "Consultar otro expediente", "Ver requisitos de mi trámite", "Hablar con asistente".

### Principios de diseño

- **Una acción principal por pantalla.**
- **Lenguaje claro**, cero jerga administrativa.
- **Estados de error humanos** ("No encontramos tu expediente. Verifica el número o escríbenos.").
- **Mobile-first**, tipografías ≥ 16px, botones ≥ 44px.

---

## 9. Plan de entrega (48 horas de hackatón)

| Hito | Tiempo acumulado | Entregable | Estado |
|---|---|---|---|
| Setup repo + estructura Next.js | +4 h | Repo con carpetas y dependencias. | ✅ Hecho |
| Integración real con API DP + datos de prueba | +8 h | Route Handler `/api/expedientes/consulta` funcional contra API real. | ✅ Hecho |
| Datos TUPA reales en JSON | +8 h | `data/mock/tupa.json` con 3 trámites reales. | ✅ Hecho |
| Formulario + página de resultado | +20 h | CU-01 y CU-02 end-to-end en el navegador. | ⏳ Pendiente |
| Manejo de errores completo | +24 h | 404, 401, 502 con mensajes humanos. | ⏳ Pendiente |
| Listado TUPA + chatbot básico | +36 h | CU-03 y CU-04. | ⏳ Pendiente |
| QA accesibilidad + responsive + pulido visual | +42 h | WCAG AA, mobile OK. | ⏳ Pendiente |
| Demo + pitch + modelo de negocio | +48 h | Presentación final. | ⏳ Pendiente |

---

## 10. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| API del DP no disponible durante la demo | Alto | Capa proxy con fallback a datos de ejemplo hardcodeados en el Route Handler. |
| Latencia desde provincias | Medio | Vercel edge network + payload mínimo + SSR. |
| Confusión del ciudadano con el campo "clave" | Medio | Microcopy + ejemplo ("Ej: 4176") + ayuda contextual. |
| Cumplimiento de Ley de Datos Personales | Alto | No persistir datos, solo proxy; no loguear nombre del administrado. |

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