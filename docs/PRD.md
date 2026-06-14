# PRD — Consulta de Expedientes Despacho Presidencial (MVP)

**Hackatón TRANSFORMAGOB 2026 · OGTIC DP**
Versión 3.0 — 2026-06-13
Owner: Equipo OGTIC DP · Punto focal: German Canaza Torres

> **Changelog v3.0:** Casos de uso marcados con estado actual; agregado soporte de quechua (CU-07) y chips contextuales como funcionalidad in-scope; nueva sección §13 "Estado actual del MVP" con lo desplegado en Vercel. Documentación técnica completa en [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`AGENT.md`](./AGENT.md), [`API.md`](./API.md) y [`DEPLOYMENT.md`](./DEPLOYMENT.md).

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

| ID | Caso de uso | Prioridad | Estado |
|---|---|---|---|
| CU-01 | Consultar estado de expediente con número + clave **a través del agente** | **P0** | ✅ En producción |
| CU-02 | Ver detalle del estado, tiempo estimado, nombre del administrado y última actualización (en hora de Lima) **en la conversación** | **P0** | ✅ En producción |
| CU-03 | Consultar requisitos, plazos, costos y canales de un trámite del TUPA **preguntándole al agente** | **P0** | ✅ En producción |
| CU-04 | Orientación general por chat (mesa de partes, horarios, qué significa cada estado, recuperar clave) | **P0** | ✅ En producción |
| CU-06 | **Recibir el resultado de la consulta por correo electrónico** (a pedido explícito del ciudadano o via chip "Envíamelo por correo") | **P1** | ✅ En producción — Gmail OAuth2 |
| CU-07 | **Atención en quechua (runasimi)** — el agente detecta el idioma y responde completamente en quechua | **P1** | ✅ En producción |
| CU-08 | **Derivación cordial en aymara** — el agente responde un mensaje único en aymara con teléfono de contacto | **P2** | ✅ En producción |
| CU-09 | **Descarga del formulario oficial SAIP** — action chip post-DP-002 que abre el PDF del SUT en pestaña nueva; respuesta del agente con enlace si se pide por lenguaje natural | **P1** | ✅ En producción |
| CU-10 | **Entrada por voz** — el ciudadano graba un mensaje, ve la transcripción aparecer en vivo en el textarea, revisa, edita y envía manualmente | **P1** | 📋 Planificado fase 2 — diseño técnico cerrado |

> **Fuera de alcance del MVP:** WhatsApp, app móvil nativa, login con cuenta gob.pe, descarga de constancias firmadas, historial cronológico de eventos (la API del DP no lo provee), compartir resultado vía link público (CU-05 descartado), notificaciones push o suscripción a cambios de estado.

---

## 5. Alcance funcional (MVP)

### Funcionalidades In-Scope

1. **Interfaz única de chat** (pantalla completa, mobile-first) — sin formularios manuales ni vistas separadas.
2. **Agente conversacional** (Claude Haiku 4.5) que entiende lenguaje natural en **español y quechua** y decide qué herramienta usar:
   - **Tool A — `consultar_expediente`**: llama a la API real del DP con `expediente` + `clave`; convierte la fecha de UTC a hora de Lima.
   - **Tool B — `enviar_resultado_por_correo`**: envía al ciudadano el resumen del expediente al correo que indique. Integrada con Gmail API vía OAuth2 (refresh token). Disponible como chip "Envíamelo por correo" tras entregar el resultado del expediente.
   - *Base de conocimiento TUPA*: incrustada en el system prompt (3 trámites: DP-001, DP-002, DP-003). No requiere tool dedicada.
3. **Respuestas con formato estructurado**: el agente usa plantillas markdown con etiquetas en negrita para entregar estado de expediente y datos de trámites; el front las renderiza con `react-markdown`.
4. **Chips contextuales**: al final de respuestas relevantes el agente sugiere 2-4 acciones rápidas (`[CHIPS: …]`) que el front pinta como pills clickables.
5. **Action chips (chips de acción directa)**: subconjunto de chips que el frontend intercepta y resuelve sin pasar por el agente. El primer caso vivo es `⬇ Descargar el formulario` después de DP-002 (SAIP), que abre el formulario oficial alojado en el SUT de la PCM en una pestaña nueva. Cero tokens, cero latencia, sin depender de la disponibilidad de la API del agente.
6. **Entrega del formulario oficial SAIP**: dos caminos paralelos — (a) action chip post-plantilla de DP-002; (b) si el ciudadano lo pide por lenguaje natural ("dame el formulario"), el agente responde con un bloque markdown con el enlace + canales de presentación (correo `accesoinf@presidencia.gob.pe`, presencial en Mesa de Partes).
7. **Detección de idioma** (quechua/español/aymara) por heurística embebida en el prompt.
8. **Manejo de errores conversacional**: cuando una tool falla (404, 401, 502, correo inválido), el agente responde con un mensaje humano y propone siguiente paso.
9. **Accesibilidad AA**: contraste, tamaños de texto, navegación por teclado, lector de pantalla (`role="log"`, `aria-live`).
10. **Responsive mobile-first** + funcionamiento en 3G + respeto del safe-area-inset-bottom para iPhone (gesture bar).
11. **Embed por iframe** habilitado (`frame-ancestors *`) para incrustar en otros sitios del Estado.

### Planificado para fase 2 (diseño técnico cerrado, no implementado en MVP)

- **Entrada por voz (CU-10)**: el ciudadano puede tocar un botón de micrófono junto al input de texto, dictar su mensaje, ver la transcripción aparecer en vivo (interim + final), editar si quiere y enviar con el botón Enviar existente. Implementación prevista:
  - **Web Speech API** del navegador (`SpeechRecognition` / `webkitSpeechRecognition`) — cero costo de infraestructura, cero envío de audio a terceros, dispara el permiso nativo del SO. Locale `es-PE`.
  - Modo **toggle** (click empieza, otro click detiene) — mejor en mobile que push-to-talk.
  - **Envío manual** post-transcripción — el ciudadano revisa antes de enviar. Crítico para números de expediente y claves donde el reconocimiento de voz suele equivocarse.
  - **Quechua queda fuera** por limitación de la Web Speech API (no soportado). El botón sigue visible y el ciudadano puede editar la transcripción a mano.
  - **Fallback**: feature detect en mount. Browsers sin soporte (Firefox, viejos) ocultan el botón sin romper el chat.
  - **Cero cambios en backend**: el agente sigue recibiendo texto plano. Es un adapter de input puro.
  - Archivos a tocar cuando se implemente: nuevo hook `frontend/src/hooks/useSpeechRecognition.ts`, botón mic en `frontend/src/components/Chat.tsx`, animación de pulse en `frontend/src/app/globals.css`. Estimación: ~80 min de implementación.

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
| **Idioma** | Español y quechua (runasimi) en producción. Aymara con mensaje de derivación. Preparado para más lenguas originarias en fase 2. |
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
| Envío de correo | **Gmail API** vía OAuth2 (refresh token) — `@/api/email` en Node.js | Cero dependencias externas adicionales; autenticación con cuenta Gmail del DP. |
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
- `GMAIL_CLIENT_ID` — OAuth2 client ID de Google Cloud.
- `GMAIL_CLIENT_SECRET` — OAuth2 client secret de Google Cloud.
- `GMAIL_REFRESH_TOKEN` — refresh token de la cuenta remitente.
- `EMAIL_FROM` — dirección Gmail remitente: `Asistente de Despacho Presidencial <asistente.de.despacho.hackaton@gmail.com>`.
- `RATE_LIMIT_PER_MIN` — default 30.

---

## 8. Experiencia de usuario

### Flujo principal (CU-01 + CU-02 + CU-06)

1. Ciudadano entra a la URL → ve **chat a pantalla completa** con un mensaje de bienvenida del agente.
2. Escribe en lenguaje natural: *"quiero ver el estado de mi expediente"*.
3. El agente le pide número de expediente y clave (uno por uno, conversación natural).
4. El agente llama a la tool `consultar_expediente` y devuelve: estado, administrado, trámite, detalle, tiempo estimado y fecha de última actualización en lenguaje claro.
5. Aparece el chip **"Envíamelo por correo"** como primera acción sugerida. Si el ciudadano lo toca (o lo pide por texto), el agente solicita su dirección de correo y llama a `enviar_resultado_por_correo` via Gmail API.

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
| Integración real con API DP | +8 h | Route Handler + tool funcional contra API real. | Front + Colaborador | ✅ Hecho |
| Datos TUPA reales en `data/tupa.json` + embebidos en prompt | +8 h | 3 trámites con datos canónicos. | Colaborador | ✅ Hecho |
| Limpieza: borrar `backend/`, `/tupa`, formulario y widget viejo | +10 h | Repo limpio para chat-only. | Front | ✅ Hecho |
| Tailwind config + globals.css + layout + Inter | +12 h | Frontend renderiza con tokens gob.pe. | Front | ✅ Hecho |
| UI del chat a pantalla completa + accesibilidad AA | +20 h | Conversación funcional, mobile-first. | Front | ✅ Hecho |
| Endpoint `/api/chat` + agente Claude Haiku 4.5 + tools + system prompt | +28 h | CU-01 a CU-04 end-to-end con agente real. | Colaborador | ✅ Hecho |
| Soporte quechua + aymara en el prompt | +30 h | CU-07 y CU-08 en producción. | Colaborador | ✅ Hecho |
| Markdown rendering + chips contextuales | +32 h | Respuestas estructuradas con acciones rápidas. | Front + Colaborador | ✅ Hecho |
| Conversión UTC → Lima en la tool | +33 h | Fechas humanas en hora local. | Front | ✅ Hecho |
| Deploy en Vercel + variables de entorno + iframe embed | +34 h | URL pública demo-able. | Front | ✅ Hecho |
| QA accesibilidad + responsive + pulido visual | +42 h | WCAG AA, mobile OK. | Front | ✅ Hecho |
| Endpoint `/api/email` con Gmail OAuth2 (envío real) | +44 h | CU-06 con envío end-to-end. | **Colaborador** | ✅ Hecho |
| Demo + pitch + modelo de negocio | +48 h | Presentación final. | Equipo completo | ⏳ En preparación |

---

## 10. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| API del DP no disponible durante la demo | Alto | Capa proxy con fallback a datos de ejemplo hardcodeados en el Route Handler. |
| Costo de tokens del agente más alto de lo esperado | Medio | History limitado a últimos 12 turnos; evaluar prompt caching de Anthropic si crece el tráfico. |
| Envío de correo bloqueado por dominios no verificados | Medio | Usar Resend con dominio sandbox; si no se logra, degradar a "te enviaríamos a tu correo X (demo)". |
| Latencia desde provincias | Medio | Vercel edge network + payload mínimo; respuesta no-streaming para el MVP. |
| Confusión del ciudadano con el campo "clave" | Medio | El agente explica con ejemplo en la conversación, no en microcopy estático. |
| Cumplimiento de Ley de Datos Personales | Alto | No persistir datos; no loguear nombre del administrado ni clave; conversación solo en memoria. |
| Alucinación del agente respondiendo TUPA inventado | Alto | Los 3 trámites están embebidos textualmente en el prompt; instrucción explícita de no mezclar datos entre trámites y de no inventar requisitos. |
| Agente no respeta el marcador `[CHIPS: …]` | Bajo | Si no aparece el marcador, el front simplemente no pinta chips — degrada elegantemente sin romper la conversación. |
| Detección de idioma confunde quechua con aymara | Medio | Heurística por palabras clave con desambiguación explícita de "ama" (prefijo quechua, NO aymara). |

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
- Iteración 2: integrar Resend para envío real de correo (CU-06 completo), **implementar la entrada por voz (CU-10) ya diseñada en fase 1 con Web Speech API** — nativa del navegador, sin costo de infraestructura, habilita atención a adultos mayores y ciudadanos en contextos donde tipear es difícil; cero cambios en el backend ni en el agente, streaming de respuestas con Server-Sent Events, autenticación con cuenta gob.pe, notificaciones por correo de cambios de estado, restringir `frame-ancestors` a dominios `*.gob.pe`.
- Iteración 3: rate limiting (Upstash Redis), observabilidad custom (eventos por turno y por tool), replicar la plataforma para otras entidades del Estado (kit reutilizable con agente y tools intercambiables), soporte de más lenguas originarias.

---

## 13. Estado actual del MVP

**URL de producción**: configurable en Vercel; el repo se redesploya en cada merge a `main`.

**Funcionalidades vivas y probables en demo:**

| Funcionalidad | CU | Probar con… |
|---|---|---|
| Consulta de expediente por chat | CU-01, CU-02 | Expediente `2026-0010582`, clave `4176`. |
| Información de trámite TUPA | CU-03 | "¿cuáles son los requisitos del SAIP?" o "qué necesito para una solicitud simple". |
| Orientación general | CU-04 | "¿dónde queda mesa de partes?", "¿qué horario tienen?". |
| Atención en quechua | CU-07 | "Allillanchu, willachikuyniyta munani". |
| Derivación en aymara | CU-08 | "Kamisaraki, yanapt'asitaxa". |
| Chips contextuales | — | Visible al iniciar y después de cada respuesta estructurada. |
| Chip "Envíamelo por correo" | CU-06 | Aparece tras entregar estado de expediente; dispara envío real via Gmail. |
| Envío de resultado por correo | CU-06 | Pedir el correo tras click en chip o solicitud por texto, luego confirmar envío. |
| Markdown en burbujas | — | Las respuestas tipo expediente y TUPA llegan formateadas. |
| Fechas en hora Lima | — | "Última actualización: hoy a las 12:53". |

**Limitaciones conocidas para producción real** (cubiertas en [`ARCHITECTURE.md §6`](./ARCHITECTURE.md), [`AGENT.md §9`](./AGENT.md) y [`API.md`](./API.md)):

1. **Sin rate limiting**: `/api/chat` no tiene protección contra abuso.
2. **Sin persistencia de historial**: si el ciudadano recarga la página, pierde la conversación.
3. **`frame-ancestors *`** demasiado abierto; restringir a `*.gob.pe` antes de pasar a producción.
4. **Sin tests automatizados**: las pruebas son manuales hoy.
