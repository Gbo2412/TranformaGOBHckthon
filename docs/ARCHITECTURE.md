# Arquitectura — Asistente DP

**Versión 1.0 · 2026-06-13**
Reemplaza a `docs/arquitectura/arquitectura.md` (archivado en `docs/archive/`).

---

## 1. Topología actual (alto nivel)

```
   ┌─────────────────────┐
   │    Ciudadano        │
   │ (Chrome/Safari móvil│
   │  o desktop)         │
   └──────────┬──────────┘
              │ HTTPS
              ▼
   ┌──────────────────────────────────────────────────────────┐
   │  Vercel Edge / Functions — Next.js 14 (App Router)       │
   │                                                          │
   │  • /            → Chat (React 18 + Tailwind + Inter)     │
   │  • /api/chat    → runAgent() → Anthropic SDK             │
   │  • /api/expedientes/consulta → proxy a API DP            │
   │  • /api/email   → stub (pendiente Resend)                │
   └─┬──────────────────────────────────┬────────────────────┬┘
     │ tool: consultar_expediente       │ tool: enviar_correo│
     ▼                                  ▼                    │
   ┌──────────────────────┐   ┌──────────────────────┐       │
   │ API DP               │   │ Servicio de correo   │       │
   │ presidencia.gob.pe   │   │ (Resend pendiente)   │       │
   └──────────────────────┘   └──────────────────────┘       │
                                                             │
                       ┌─────────────────────────────────────┘
                       ▼
           ┌──────────────────────┐
           │ Claude Haiku 4.5     │
           │ api.anthropic.com    │
           │ (tool use loop)      │
           └──────────────────────┘
```

## 2. Stack confirmado

| Capa | Tecnología | Notas |
|---|---|---|
| Hosting | **Vercel** | Root Directory `proyecto/frontend`, Framework Preset `Next.js`. |
| Framework | **Next.js 14.2** (App Router) + TypeScript | Full-stack en un solo repo. |
| Runtime | **Node.js** en Vercel Functions | Necesario para `@anthropic-ai/sdk` y futuro Resend. |
| UI | **React 18** + **Tailwind CSS 3.4** + **Inter** (`next/font/google`) | Tokens en `tailwind.config.ts`. |
| Markdown en chat | `react-markdown` + `remark-breaks` | Negritas, listas, hr, mailto clickable. |
| LLM | **Claude Haiku 4.5** vía `@anthropic-ai/sdk` | `model: "claude-haiku-4-5"`. |
| Datos TUPA | JSON estático versionado en `frontend/src/data/tupa.json` | Versionable por PR. |
| API de expedientes | API REST del DP (`presidencia.gob.pe/api/consulta-expedientes/index.php`) | Datos: número + clave. |
| Envío de correo | Gmail API OAuth2 en `/api/email` + `tools.ts` | `GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN` + `EMAIL_FROM`. |
| Observabilidad | Vercel Analytics + logs de Functions | Sin telemetría custom todavía. |

## 3. Estructura de carpetas

```
proyecto/
├── docs/                              # toda la documentación viva
│   ├── README.md                     ← índice
│   ├── PRD.md                        ← producto + casos de uso
│   ├── DESIGN.md                     ← sistema visual + accesibilidad
│   ├── ARCHITECTURE.md               ← este archivo
│   ├── API.md                        ← contratos de endpoints
│   ├── AGENT.md                      ← system prompt + tools + idiomas
│   ├── DEPLOYMENT.md                 ← Vercel, env vars, iframe
│   ├── modelo-negocio/canvas.md
│   ├── ux/insights.md
│   └── archive/arquitectura.md       ← versión anterior (Express)
│
├── frontend/                          # único proyecto desplegable
│   ├── next.config.mjs               ← headers iframe (frame-ancestors *)
│   ├── tailwind.config.ts            ← tokens gob.pe
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app/
│       │   ├── layout.tsx            ← Inter, viewport
│       │   ├── page.tsx              ← monta <Chat />
│       │   ├── globals.css           ← :focus-visible, prefers-reduced-motion
│       │   └── api/
│       │       ├── chat/route.ts             ← runAgent + extrae chips
│       │       ├── expedientes/consulta/route.ts  ← proxy directo a DP
│       │       └── email/route.ts            ← stub Resend
│       │
│       ├── components/
│       │   ├── Chat.tsx              ← UI completa (header, lista, chips, input)
│       │   └── SystemBubble.tsx      ← errores de red con "Reintentar"
│       │
│       ├── lib/
│       │   ├── agent.ts              ← loop tool use con Anthropic SDK
│       │   ├── prompt.ts             ← SYSTEM_PROMPT (idiomas, formatos, chips)
│       │   └── tools.ts              ← consultar_expediente + enviar_correo + UTC→Lima
│       │
│       └── data/
│           └── tupa.json             ← base de conocimiento TUPA (DP-001/002/003)
```

## 4. Decisiones técnicas

### 4.1 Next.js full-stack en lugar de Express + Next separados
- **Por qué**: simplifica deploy (un solo target en Vercel), elimina CORS, permite que las Route Handlers usen `process.env` del mismo proceso, y mantiene el bundle pequeño.
- **Trade-off**: cualquier capa de "backend pesado" futura tendría que migrar a Vercel Functions o a un servicio aparte.

### 4.2 Claude Haiku 4.5 (no Sonnet ni Opus)
- **Por qué**: la lógica del agente es predominantemente recuperar datos, mapear a una plantilla y mantener tono. Haiku 4.5 es suficiente, más rápido y más barato.
- **Cuándo subir**: si las pruebas de campo muestran que el agente alucina datos o falla detectando quechua, evaluar Sonnet 4.6.

### 4.3 Marcador `[CHIPS: …]` en lugar de tool dedicada
- **Por qué**: no requiere cambiar el contrato de tools, no afecta el loop del agente, y el parsing es trivial (regex en `/api/chat`). Una tool dedicada habría sumado un round-trip y latencia.
- **Trade-off**: la convención es frágil — si el modelo no respeta el formato exacto, los chips no aparecen. Se mitiga con instrucciones explícitas en el prompt y se valida en producción.

### 4.4 Iframe embedding habilitado (`frame-ancestors *`)
- **Por qué**: el equipo DP quiere poder embeber el chat en gob.pe u otras propiedades del Estado sin reabrir CSP por dominio.
- **Trade-off**: cualquiera puede embeber. Para producción real conviene restringir a `gob.pe` y subdominios oficiales.

### 4.5 Datos TUPA en JSON estático versionado
- **Por qué**: 3 trámites con cambios poco frecuentes. Un PR es la pista de auditoría natural.
- **Cuándo migrar**: si los trámites pasan de ~10 o si necesitan actualizaciones en runtime, mover a una base externa o CMS headless.

### 4.6 Conversión UTC → Lima dentro de la tool, no del prompt
- **Por qué**: el modelo no conoce la hora actual y las conversiones de zona horaria con LLM son frágiles. `Intl.DateTimeFormat` con `timeZone: "America/Lima"` es determinista.
- **Implementación**: `frontend/src/lib/tools.ts → humanizarFechaLima()`.

## 5. Flujo de una consulta de expediente (end-to-end)

```
1. Usuario: "quiero ver mi expediente"
2. Front → POST /api/chat { mensaje, history }
3. /api/chat → runAgent(mensaje, history)
4. runAgent → Anthropic (mensaje + SYSTEM_PROMPT + TOOLS)
5. Claude responde pidiendo número + clave (sin tool todavía)
6. /api/chat extrae [CHIPS:] (no hay) → devuelve { respuesta }
7. Usuario envía "2026-0010582 / 4176"
8. /api/chat → runAgent
9. Claude decide usar tool consultar_expediente con { expediente, clave }
10. tools.ts → POST a API DP → recibe JSON → mapea + humaniza fecha a Lima
11. runAgent envía tool_result a Claude
12. Claude redacta respuesta con la plantilla del expediente + marcador [CHIPS:]
13. /api/chat extrae [CHIPS:] → devuelve { respuesta, chips }
14. Front pinta burbuja con markdown + chips clickables debajo
```

## 6. Estado de cada componente

| Componente | Estado | Notas |
|---|---|---|
| Chat UI | ✅ Producción | Mobile-first, AA, Inter, gob.pe tokens. |
| Agente Claude + tool use | ✅ Producción | Haiku 4.5, max_tokens 1024. |
| Tool `consultar_expediente` | ✅ Producción | Contra API DP real. |
| Tool `enviar_resultado_por_correo` | ✅ Producción | Gmail API OAuth2. Chip "Envíamelo por correo" post-expediente. |
| Idioma quechua | ✅ Producción | Detección por heurística + respuesta completa en quechua. |
| Idioma aymara | ✅ Producción | Mensaje único de derivación. |
| Chips contextuales | ✅ Producción | Marcador `[CHIPS:…]` parseado en `/api/chat`. |
| Conversión UTC → Lima | ✅ Producción | `Intl.DateTimeFormat` con `America/Lima`. |
| Manejo de errores DP (401/404/502) | ✅ Producción | Mensajes humanos vía prompt. |
| Iframe embedding | ✅ Producción | `frame-ancestors *` (revisar para v1.0 real). |
| Observabilidad | 🟡 Mínima | Vercel Analytics. Falta dashboard custom. |
| Tests automatizados | ❌ Ausente | Fuera de scope MVP. Sugerido para v1.1. |
