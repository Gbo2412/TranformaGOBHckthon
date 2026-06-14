# Asistente del Despacho Presidencial

**Hackatón TRANSFORMAGOB 2026 · Equipo OGTIC DP**

> ¿Cómo podríamos ayudar a los ciudadanos a saber el estado de sus expedientes ante el Despacho Presidencial y recibir orientación oportuna, sin acudir a ventanilla y sin importar el horario ni la ubicación?

Kit conversacional para el Estado peruano: un agente con tools y plantillas estructuradas que cualquier entidad puede instanciar en un día. Hoy en producción contra la API real del Despacho Presidencial, en español y quechua.

## Probarlo

**URL pública:** https://tranforma-gob-hckthon.vercel.app

**Credenciales de prueba** (expediente real de demo provisto por el DP):
- Número de expediente: `2026-0010582`
- Clave: `4176`

## Documentación

Toda la documentación viva está en [`docs/`](./docs/). Empieza por:

| Documento | Para… |
|---|---|
| [`docs/README.md`](./docs/README.md) | Índice del directorio y guía "por dónde empezar según tu rol" |
| [`docs/PRD.md`](./docs/PRD.md) | Qué problema resolvemos, casos de uso, métricas, estado actual del MVP |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Stack, topología, decisiones técnicas |
| [`docs/AGENT.md`](./docs/AGENT.md) | System prompt, tools, idiomas, chips, plantillas |
| [`docs/API.md`](./docs/API.md) | Contratos de los endpoints |
| [`docs/DESIGN.md`](./docs/DESIGN.md) | Sistema visual (paleta gob.pe) y accesibilidad |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Vercel, variables de entorno, dev local |

## Estructura del repositorio

```
proyecto/
├── docs/              # Documentación viva (PRD, arquitectura, agente, API, design, deployment)
├── frontend/          # Aplicación Next.js 14 (chat + API en Vercel Functions)
│   └── src/
│       ├── app/       # Páginas y Route Handlers (/api/chat, /api/expedientes, /api/email)
│       ├── components/  # Chat, SystemBubble
│       ├── lib/       # Agente (Claude), tools, system prompt
│       └── data/      # Base de conocimiento TUPA (versionable por PR)
├── LICENSE            # MIT
└── README.md
```

## Stack

- **Hosting:** Vercel (despliegue continuo desde `main`)
- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Inter
- **Agente:** Claude Haiku 4.5 vía `@anthropic-ai/sdk` con tool use
- **Tools:** `consultar_expediente` (API real DP), `enviar_resultado_por_correo` (stub Resend pendiente)
- **Renderizado conversacional:** `react-markdown` + `remark-breaks` + chips contextuales

El núcleo es agnóstico al modelo: hoy usamos Claude Haiku 4.5, pero es reemplazable por cualquier LLM open source (Llama, Mistral, DeepSeek) sin tocar el núcleo, habilitando despliegue on-prem y soberanía digital.

## Licencia

Distribuido bajo licencia **MIT** — ver [`LICENSE`](./LICENSE). Alineado con el **Decreto Legislativo N° 1412 (Ley de Gobierno Digital), art. 29 — Reutilización de Software**: cualquier entidad de la Administración Pública puede usarlo, copiarlo, acceder al código, modificarlo colaborativamente y distribuirlo en beneficio del Estado Peruano.

## Equipo

Gabriel Fretel Santivañez - https://www.linkedin.com/in/gabriel-victor-fretel/
Rodrigo Canahuire Cama - https://www.linkedin.com/in/rodrigocanahuirecama/
