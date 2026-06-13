# PRD — Consulta de Expedientes Despacho Presidencial (MVP)

**Hackatón TRANSFORMAGOB 2026 · OGTIC DP**
Versión 2.0 — 2026-06-13
Owner: Equipo OGTIC DP · Punto focal: German Canaza Torres

---

## 1. Resumen ejecutivo

Plataforma web pública que permite a cualquier ciudadano consultar el estado de su expediente ante el Despacho Presidencial, conocer los requisitos del TUPA y recibir el resultado por correo, 24/7, **conversando con un agente** desde cualquier dispositivo con navegador, sin instalar nada.

El MVP se entrega como una **web app desplegada en Vercel** (Next.js full-stack, Node.js). La única interfaz para el ciudadano es un **chat con un agente** que internamente consulta la API de expedientes del Despacho Presidencial, la base de conocimiento del TUPA y un servicio de envío de correo.

---

## 2. Problema

- 250 consultas/mes al Despacho Presidencial; **65% son de regiones fuera de Lima**.
- Tiempo promedio de respuesta por canal presencial: **15 días hábiles**.
- **30% de consultas son repetitivas** sobre un mismo expediente.
- Ciudadano de Puno gasta **S/350–S/700** y **2–4 días** por consulta presencial.
- Los canales actuales dependen de horarios de oficina y traslado físico.

## 3. Objetivo del MVP

Demostrar que un ciudadano puede, en **menos de 60 segundos** y desde su celular, conocer el estado real de su expediente y los próximos pasos de su trámite, conversando con un agente, sin formularios ni asistencia humana.

### Métricas de éxito (post-piloto)

| Métrica | Línea base | Meta a 3 meses |
|---|---|---|
| Consultas atendidas vía chat | 0 | ≥ 60% del total |
| Tiempo a respuesta (consulta de estado) | 15 días | < 1 minuto |
| Consultas presenciales repetitivas | 30% | ≤ 10% |
| NPS de ciudadanos atendidos | — | ≥ 50 |
| Tasa de envío exitoso del resultado por correo | — | ≥ 90% |

---

## 4. Usuarios y casos de uso

### Personas

1. **Ciudadano de provincia (María, 52, Puno)** — quiere saber si su solicitud avanzó sin viajar a Lima.
2. **Trabajador urbano (Luis, 34, Lima)** — solo puede consultar fuera de horario de oficina.
3. **Adulto mayor (Don José, 68)** — necesita una conversación simple, en lenguaje claro.

### Casos de uso del MVP

| ID | Caso de uso | Prioridad |
|---|---|---|
| CU-01 | Consultar estado de expediente con número + clave **a través del agente** | **P0** |
| CU-02 | Ver detalle del estado, tiempo estimado de resolución y nombre del administrado **en la conversación** | **P0** |
| CU-03 | Consultar requisitos, plazos, costos y canales de un trámite del TUPA **preguntándole al agente** | **P0** |
| CU-04 | Orientación general por chat (mesa de partes, horarios, qué significa cada estado, recuperar clave) | **P0** |
| CU-06 | **Recibir el resultado de la consulta por correo electrónico** (a pedido del ciudadano dentro del chat) | **P1** |

> **Fuera de alcance del MVP:** WhatsApp, app móvil nativa, login con cuenta gob.pe, descarga de constancias firmadas, historial cronológico de eventos (la API del DP no lo provee), compartir resultado vía link público (CU-05 descartado), notificaciones push o suscripción a cambios de estado.

---

## 5. Alcance funcional (MVP)

### Funcionalidades In-Scope

1. **Interfaz única de chat** (pantalla completa, mobile-first) — sin formularios manuales ni vistas separadas.
2. **Agente conversacional** que entiende lenguaje natural en español y decide qué herramienta usar:
   - **Tool A — `consultar_expediente`**: llama a la API real del DP con `expediente` + `clave`.
   - **Tool B — `obtener_tupa`**: consulta la base de conocimiento de trámites (JSON versionado en el repo).
   - **Tool C — `enviar_resultado_por_correo`**: envía al ciudadano el resumen del expediente al correo que indique.
3. **Manejo de errores conversacional**: cuando una tool falla (404, 401, 502, correo inválido), el agente responde con un mensaje humano y propone siguiente paso.
4. **Accesibilidad AA**: contraste, tamaños de texto, navegación por teclado, lector de pantalla.
5. **Responsive mobile-first** + funcionamiento en 3G.

### Out-of-Scope (MVP)

- Formularios tradicionales para consulta (todo va por chat).
- Vista navegable de TUPA en página dedicada (`/tupa` eliminada).
- WhatsApp / SMS / canales de mensajería externos.
- App móvil nativa o instalable obligatoria.
- Autenticación con DNIe o cuenta gob.pe.
- Carga de documentos / inicio de nuevos trámites.
- Pasarela de pagos.
- Panel administrativo para funcionarios del DP.
- Notificaciones push o suscripción a cambios de estado.
- Historial cronológico de eventos (no disponible en la API actual del DP).
- Compartir resultado vía link público.

---

## 6. Requerimientos no funcionales

| Categoría | Requerimiento |
|---|---|
| **Disponibilidad** | 99% en horario 24/7 durante el piloto. |
| **Performance** | LCP < 2.5s en 3G; tiempo a primer token del agente < 2s p95. |
| **Accesibilidad** | WCAG 2.1 AA. |
| **Seguridad** | HTTPS obligatorio; clave del expediente nunca se persiste; rate limiting por IP en endpoint del chat. |
| **Privacidad** | No almacenar datos personales del ciudadano. Conversaciones se guardan en memoria solo durante la sesión. Cumplir Ley N° 29733 de Protección de Datos. |
| **Cumplimiento** | Ley de Gobierno Digital (DL 1412), alineamiento al TUPA del DP (DS N° 062-2010-PCM mod. por RM N° 272-2017-PCM). |
| **Idioma** | Español; preparado para quechua/aimara en fase 2. |
| **Compatibilidad** | Navegadores Chrome/Safari/Edge/Firefox últimas 2 versiones; iOS 14+, Android 8+. |
| **Runtime** | 100% Node.js sobre Next.js (Vercel Functions). Sin servidores adicionales. |

---

## 7. Arquitectura técnica

### Stack

| Capa | Tecnología | Razón |
|---|---|---|
| Hosting | **Vercel** | Despliegue continuo desde `main`, edge network global, HTTPS automático. |
| Framework | **Next.js 14** (App Router) + React 18 + TypeScript | Full-stack en un solo repo; Route Handlers reemplazan servidor Express. |
| Runtime | **Node.js** en Vercel Functions | Compatible con `@anthropic-ai/sdk` y librerías de envío de correo. |
| Estilos | **Tailwind CSS** | Diseño accesible y rápido de iterar. |
| Agente | **Claude (Anthropic) vía `@anthropic-ai/sdk`** + tool use | Orquesta las 3 tools por lenguaje natural. |
| API de expedientes | API REST provista por el DP (`POST https://www.presidencia.gob.pe/api/consulta-expedientes/index.php`) | Fuente de verdad del estado del expediente. |
| Base de conocimiento TUPA | JSON versionado en el repo (`frontend/src/data/tupa.json`) | Versionable por PR; importable directo como módulo en Node. |
| Envío de correo | Servicio transaccional (ej. Resend) — definido por el colaborador | Endpoint simple, soporta dominios verificados. |
| Observabilidad | Vercel Analytics + logs de Vercel Functions | Incluido en la plataforma. |

### Diagrama lógico

```
   ┌────────────────┐
   │  Navegador     │
   │  (móvil/desk)  │
   └────────┬───────┘
            │ HTTPS (chat UI)
            ▼
   ┌──────────────────────────────────────────────┐
   │  Vercel — Next.js (Node.js)                  │
   │                                              │
   │   /api/chat ──▶ Agente Claude                │
   │                  │                           │
   │                  ├─ tool: consultar_expediente ──▶ API DP
   │                  ├─ tool: obtener_tupa ──────────▶ tupa.json
   │                  └─ tool: enviar_correo ────────▶ Resend
   └──────────────────────────────────────────────┘
```

### División de responsabilidades

| Área | Responsable | Entregable |
|---|---|---|
| UI del chat (full screen, mobile-first, accesible) | **Equipo front (nosotros)** | `app/page.tsx`, `components/Chat.tsx`, `globals.css`, `tailwind.config.ts`. |
| Layout, fonts, estilos globales, Tailwind setup | **Equipo front (nosotros)** | `app/layout.tsx`, `globals.css`. |
| Endpoint `/api/chat` (recibe mensaje + history) | **Colaborador** | `app/api/chat/route.ts`. |
| `SYSTEM_PROMPT` del agente | **Colaborador** | `lib/prompt.ts`. |
| Definición de tools y loop de tool use | **Colaborador** | `lib/agent.ts`, `lib/tools.ts`. |
| Endpoint `/api/email` (envío transaccional) | **Colaborador** | `app/api/email/route.ts`. |
| Endpoint `/api/expedientes/consulta` (ya existe) | Ya implementado | — |
| Base de conocimiento TUPA | **Equipo front (nosotros)** | Mover JSON a `frontend/src/data/tupa.json`. |

### Contratos de endpoints

**POST `/api/chat`** — único endpoint que consume el frontend.

Request:
```json
{
  "mensaje": "quiero saber el estado de mi expediente 2026-0010582",
  "history": [
    { "role": "user", "content": "hola" },
    { "role": "assistant", "content": "¡Hola! ¿En qué puedo ayudarte?" }
  ]
}
```

Response 200 (no-streaming, MVP):
```json
{
  "respuesta": "Claro, necesito tu clave numérica para consultar el expediente 2026-0010582. ¿Me la puedes compartir?",
  "history": [/* history actualizado */]
}
```

> **Streaming** (Server-Sent Events) es opcional para fase 2; el MVP arranca con respuesta única.

**POST `/api/expedientes/consulta`** — tool del agente. Ya implementado.

**POST `/api/email`** — tool del agente. Request: `{ destinatario, asunto, cuerpo }`. Response: `{ ok: true }` o `{ error }`.

### Variables de entorno (Vercel)

- `ANTHROPIC_API_KEY` — API key de Claude.
- `DP_API_BASE_URL` — URL de la API del DP (con default).
- `RESEND_API_KEY` (o equivalente) — para envío de correo.
- `EMAIL_FROM` — dirección remitente verificada.
- `RATE_LIMIT_PER_MIN` — default 30.

---

## 8. Experiencia de usuario

### Flujo principal (CU-01 + CU-02 + CU-06)

1. Ciudadano entra a la URL → ve **chat a pantalla completa** con un mensaje de bienvenida del agente.
2. Escribe en lenguaje natural: *"quiero ver el estado de mi expediente"*.
3. El agente le pide número de expediente y clave (uno por uno, conversación natural).
4. El agente llama a la tool `consultar_expediente` y devuelve: estado, administrado, trámite, detalle, tiempo estimado y fecha de última actualización en lenguaje claro.
5. El agente ofrece: *"¿Quieres que te envíe este resultado por correo?"* → si el ciudadano acepta, pide el correo y llama a `enviar_resultado_por_correo`.

### Flujo de TUPA (CU-03)

1. Ciudadano pregunta: *"¿qué necesito para presentar una solicitud de acceso a información?"*.
2. El agente llama a `obtener_tupa` con el tipo de trámite y devuelve requisitos, plazo, costo y canal.

### Principios de diseño

- **Una conversación, una pantalla.** Sin tabs, sin sidebars, sin modales.
- **Lenguaje claro**, cero jerga administrativa.
- **Mensajes humanos en errores**: el agente nunca devuelve códigos HTTP al usuario.
- **Mobile-first**, tipografías ≥ 16px, área de toque ≥ 44px.
- **Sugerencias de primera interacción**: chips de "consultar mi expediente", "ver requisitos", "horarios de atención" al inicio de la conversación.

---

## 9. Plan de entrega (48 horas de hackatón)

| Hito | Tiempo acumulado | Entregable | Responsable | Estado |
|---|---|---|---|---|
| Setup repo + estructura Next.js | +4 h | Repo con carpetas y dependencias. | Front | ✅ Hecho |
| Integración real con API DP (`/api/expedientes/consulta`) | +8 h | Route Handler funcional contra API real. | Front | ✅ Hecho |
| Datos TUPA reales en JSON | +8 h | `data/tupa.json` con 3 trámites reales. | Front | ✅ Hecho |
| Limpieza: borrar `backend/`, `/tupa`, formulario y widget viejo | +10 h | Repo limpio para chat-only. | Front | ⏳ Pendiente |
| Tailwind config + globals.css + layout | +12 h | Frontend renderiza estilos en Vercel. | Front | ⏳ Pendiente |
| UI del chat a pantalla completa | +20 h | Conversación funcional con backend mock. | Front | ⏳ Pendiente |
| Endpoint `/api/chat` + agente + tools + system prompt | +28 h | CU-01 a CU-04 end-to-end con agente real. | **Colaborador** | ⏳ Pendiente |
| Endpoint `/api/email` + envío real | +32 h | CU-06 funcional. | **Colaborador** | ⏳ Pendiente |
| Deploy en Vercel + variables de entorno | +34 h | URL pública demo-able. | Front | ⏳ Pendiente |
| QA accesibilidad + responsive + pulido visual | +42 h | WCAG AA, mobile OK. | Front | ⏳ Pendiente |
| Demo + pitch + modelo de negocio | +48 h | Presentación final. | Equipo completo | ⏳ Pendiente |

---

## 10. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| API del DP no disponible durante la demo | Alto | Capa proxy con fallback a datos de ejemplo hardcodeados en el Route Handler. |
| Costo de tokens del agente más alto de lo esperado | Medio | Limitar tamaño del `history` enviado y cachear `obtener_tupa`. |
| Envío de correo bloqueado por dominios no verificados | Medio | Usar Resend con dominio sandbox; si no se logra, degradar a "te enviaríamos a tu correo X (demo)". |
| Latencia desde provincias | Medio | Vercel edge network + payload mínimo; respuesta no-streaming para el MVP. |
| Confusión del ciudadano con el campo "clave" | Medio | El agente explica con ejemplo en la conversación, no en microcopy estático. |
| Cumplimiento de Ley de Datos Personales | Alto | No persistir datos; no loguear nombre del administrado ni clave; conversación solo en memoria. |
| Alucinación del agente respondiendo TUPA inventado | Alto | `obtener_tupa` siempre lee del JSON; en el system prompt prohibir responder TUPA sin haber llamado la tool. |

---

## 11. Métricas a instrumentar en el MVP

- N° de conversaciones iniciadas / completadas con consulta exitosa por día.
- Tasa de error por tool (`consultar_expediente` 404/401/502, `enviar_correo` rechazado).
- Tiempo p50/p95 a primer token del agente.
- N° de envíos de correo exitosos.
- Origen geográfico de los visitantes (analítica anónima).
- N° de turnos promedio por conversación (proxy de fricción).

---

## 12. Post-hackatón

- Pruebas con usuarios reales coordinadas por el lab del DP.
- Iteración 2: streaming de respuestas, soporte quechua/aimara, autenticación con cuenta gob.pe, notificaciones por correo de cambios de estado.
- Iteración 3: replicar la plataforma para otras entidades del Estado (kit reutilizable con agente y tools intercambiables).
