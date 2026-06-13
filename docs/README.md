# Documentación — Asistente DP

Carpeta de documentación viva del proyecto **Asistente del Despacho Presidencial** (Hackatón TRANSFORMAGOB 2026).

Toda esta documentación refleja **el estado actual de `main`**. Está pensada para que un equipo nuevo pueda tomar el proyecto y entenderlo en menos de 1 hora.

---

## Índice

| Documento | Para… |
|---|---|
| [PRD.md](./PRD.md) | Entender el **producto**: qué problema resuelve, casos de uso, métricas y alcance. |
| [DESIGN.md](./DESIGN.md) | El **sistema visual**: paleta gob.pe, tipografía, componentes, accesibilidad AA. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | La **topología técnica**: stack, decisiones, estructura de carpetas, flujos. |
| [AGENT.md](./AGENT.md) | El **comportamiento del agente**: prompt, tools, idiomas, chips, plantillas. |
| [API.md](./API.md) | Los **contratos** de los 3 endpoints (`/api/chat`, `/api/expedientes/consulta`, `/api/email`). |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Cómo **desplegar y operar**: Vercel, variables de entorno, iframe, dev local. |
| [modelo-negocio/canvas.md](./modelo-negocio/canvas.md) | Canvas de **modelo de negocio**. |
| [ux/insights.md](./ux/insights.md) | **Insights de campo** del Lab DP que motivaron el diseño. |
| [archive/](./archive/) | Versiones anteriores de documentos. |

---

## ¿Por dónde empezar?

| Si tu rol es… | Empieza por… |
|---|---|
| **Product / negocio** | `PRD.md` → `modelo-negocio/canvas.md` → `ux/insights.md` |
| **Diseño / UX** | `DESIGN.md` → `PRD.md` → `AGENT.md` (para entender el flujo conversacional) |
| **Frontend** | `ARCHITECTURE.md` → `DESIGN.md` → `Chat.tsx` |
| **Backend / Agente** | `AGENT.md` → `API.md` → `prompt.ts`, `tools.ts`, `agent.ts` |
| **DevOps / Infra** | `DEPLOYMENT.md` → `ARCHITECTURE.md` |
| **Stakeholder DP** | `PRD.md` (especialmente §13 "Estado actual del MVP") |

---

## Estado del MVP

| Componente | Estado |
|---|---|
| Chat UI (Next.js + Tailwind + Inter) | ✅ En producción |
| Agente Claude Haiku 4.5 + tool use | ✅ En producción |
| Tool `consultar_expediente` (vs API DP real) | ✅ En producción |
| Tool `enviar_resultado_por_correo` | 🟡 Stub (falta Resend) |
| Idioma quechua (runasimi) | ✅ En producción |
| Idioma aymara (derivación) | ✅ En producción |
| Chips contextuales | ✅ En producción |
| Conversión UTC → Lima | ✅ En producción |
| Embed por iframe | ✅ En producción (revisar para v1.0 real) |

Detalle completo en [`PRD.md §13`](./PRD.md) y [`ARCHITECTURE.md §6`](./ARCHITECTURE.md).
