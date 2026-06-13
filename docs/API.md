# API — Asistente DP

**Versión 1.0 · 2026-06-13**
Contratos de los 3 endpoints expuestos por el proyecto en Vercel.

---

## Tabla resumen

| Endpoint | Método | Quién lo llama | Estado |
|---|---|---|---|
| `/api/chat` | POST | Frontend (`Chat.tsx`) | ✅ Producción |
| `/api/expedientes/consulta` | POST | Tool del agente (`tools.ts`) | ✅ Producción |
| `/api/email` | POST | Tool del agente (planeado) | 🟡 Stub (no envía correo real) |

Todos corren con `runtime = "nodejs"` en Vercel Functions.

---

## 1. `POST /api/chat`

Único endpoint que consume el navegador. Orquesta al agente y devuelve la respuesta lista para pintar.

### Request

```http
POST /api/chat
Content-Type: application/json
```

```json
{
  "mensaje": "quiero ver el estado de mi expediente",
  "history": [
    { "role": "user",      "content": "hola" },
    { "role": "assistant", "content": "¡Hola! ¿En qué puedo ayudarte?" }
  ]
}
```

- `mensaje` (string, requerido): último turno del usuario.
- `history` (array, opcional): turnos anteriores. Solo `role: "user" | "assistant"` y `content: string`. El endpoint manda los **últimos 12** al modelo.

### Response 200

```json
{
  "respuesta": "Para consultar tu expediente necesito dos datos: número de expediente y clave numérica.",
  "chips": [],
  "history": [
    { "role": "user", "content": "hola" },
    { "role": "assistant", "content": "¡Hola! ..." },
    { "role": "user", "content": "quiero ver el estado de mi expediente" },
    { "role": "assistant", "content": "Para consultar tu expediente..." }
  ]
}
```

- `respuesta`: texto markdown listo para `<ReactMarkdown>` en el front. **No incluye el marcador `[CHIPS: …]`** — ya fue recortado.
- `chips`: array de strings (puede ser vacío). Si tiene contenido, el front los pinta como pills clickables.
- `history`: history actualizado con el turno actual. El front lo usa como fuente de verdad para el próximo POST.

### Response con chips

Cuando la respuesta del agente termina con `[CHIPS: ...]`, el endpoint lo extrae:

**Texto raw del agente:**
```
**Aquí está el estado de tu expediente:**
...

[CHIPS: ¿Qué significa este estado? | Consultar otro expediente | Información de un trámite]
```

**Response al front:**
```json
{
  "respuesta": "**Aquí está el estado de tu expediente:**\n...",
  "chips": [
    "¿Qué significa este estado?",
    "Consultar otro expediente",
    "Información de un trámite"
  ],
  "history": [...]
}
```

Parsing en `frontend/src/app/api/chat/route.ts`:
```ts
const CHIPS_MARKER = /\n*\[CHIPS:\s*([^\]]+)\]\s*$/i;
```
- Split por `|`, trim, filtra strings vacíos o > 60 caracteres.

### Errores

| Code | Cuerpo | Cuándo |
|---|---|---|
| 400 | `{ "error": "El mensaje es requerido." }` | `mensaje` vacío o ausente. |
| 500 | `{ "error": "Tuvimos un problema procesando tu mensaje..." }` | Excepción en el loop del agente. El stack se loguea con `console.error` en Vercel. |

### Variables de entorno

- `ANTHROPIC_API_KEY` — requerida.
- `DP_API_BASE_URL` — usada indirectamente vía la tool (ver §2).

---

## 2. `POST /api/expedientes/consulta`

Endpoint legacy / debug. Hoy **no lo consume el front directamente** — el agente usa la **tool `consultar_expediente`** (definida en `tools.ts`) que llama directo a la API DP. Este endpoint sigue existiendo para:

- Testing manual desde `curl` o Postman.
- Posible uso futuro si decidimos exponer un formulario fallback.

### Request

```http
POST /api/expedientes/consulta
Content-Type: application/json
```

```json
{
  "expediente": "2026-0010582",
  "clave": "4176"
}
```

### Response 200

```json
{
  "expediente": "2026-0010582",
  "tramite": "Solicitud de Audiencia Presidencial",
  "administrado": "QUISPE MAMANI ROSA ELENA",
  "estadoActual": "EN PROCESO",
  "detalleEstado": "Su expediente se encuentra en proceso...",
  "ultimaActualizacion": "2026-06-13 17:53:00",
  "tiempoEstimadoDias": 5,
  "mensaje": "Consulta procesada exitosamente."
}
```

**Importante**: este endpoint **no humaniza la fecha** — devuelve la fecha tal cual viene de la API DP (UTC). La tool del agente (`tools.ts → consultarExpediente`) es la que aplica `humanizarFechaLima()` para devolver `"hoy a las 12:53"`.

### Errores

| Code | Cuándo |
|---|---|
| 400 | Falta `expediente` o `clave`. |
| 401 | Clave incorrecta (API DP). |
| 404 | Expediente no encontrado (API DP). |
| 502 | API DP caída o respondió no-OK. |

---

## 3. `POST /api/email`

🟡 **Estado: STUB.** No envía correo real. Devuelve OK para que el flujo del agente funcione end-to-end durante demo.

### Request

```http
POST /api/email
Content-Type: application/json
```

```json
{
  "destinatario": "ciudadano@example.com",
  "asunto": "Estado de tu expediente 2026-0010582 — Despacho Presidencial",
  "cuerpo": "Hola, aquí el resumen de tu expediente..."
}
```

### Response 200 (stub)

```json
{
  "ok": true,
  "nota": "Stub — envío real pendiente de integración por el colaborador."
}
```

### Errores

| Code | Cuándo |
|---|---|
| 400 | Falta `destinatario`, `asunto` o `cuerpo`. |

### Trabajo pendiente para producción

1. Instalar `resend` (o servicio equivalente verificado para `*.gob.pe`).
2. Configurar dominio remitente verificado.
3. Reemplazar el `console.log` por la llamada real al servicio.
4. Conectar la tool `enviar_resultado_por_correo` en `tools.ts` a este endpoint (hoy la tool tiene su propio stub, no llama a `/api/email`).
5. Variables de entorno: `RESEND_API_KEY`, `EMAIL_FROM`.

---

## 4. Convenciones generales

### Encoding
- Todo JSON UTF-8.
- Espaciado/separadores conservados (no normalizar acentos).

### Manejo de PII
- No persistimos: clave del expediente, nombre del administrado, ni contenido de la conversación.
- `console.log` está habilitado en stubs para debug — **revisar antes de pasar a producción real**.

### CORS / Iframe
- Todas las rutas heredan los headers definidos en `next.config.mjs`:
  - `X-Frame-Options: ALLOWALL`
  - `Content-Security-Policy: frame-ancestors *`
- Esto habilita embeber el chat en otras propiedades del Estado. Para v1.0 real conviene restringir `frame-ancestors` a dominios `*.gob.pe`.

### Rate limiting
- **No implementado.** Es un riesgo si el chat se hace viral. Para producción real conviene un middleware (Vercel KV o Upstash Redis con sliding window).
