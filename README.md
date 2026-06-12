# Despacho Presidencial — Consulta de Expedientes 24/7

Solución para el Hackatón **TRANSFORMAGOB 2026** — Desafío OGTIC DP.

> ¿Cómo podríamos ayudar a los ciudadanos a saber el estado de sus expedientes y recibir orientación oportuna, sin acudir a ventanilla, sin importar el horario ni la ubicación?

## Propuesta

Web app desplegada en **Vercel** que se conecta a la API de consulta de expedientes del Despacho Presidencial y permite a cualquier ciudadano:

1. Consultar el estado de su expediente en tiempo real (expediente + clave).
2. Recibir orientación guiada sobre requisitos de trámites del TUPA.
3. Acceder desde cualquier dispositivo con navegador, sin instalar nada.

Ver [`docs/PRD.md`](docs/PRD.md) para el documento de producto del MVP.

## Estructura del repositorio

```
proyecto/
├── frontend/        # PWA Next.js — consulta web + chat embebido
├── backend/         # API REST (Node/Express) — orquesta API de expedientes
├── chatbot/         # Motor conversacional (intents, flujos, NLP)
├── data/            # Mock JSON de expedientes y TUPA
├── docs/            # Arquitectura, modelo de negocio, UX research
└── infra/           # Docker, scripts de despliegue
```

## Stack

- **Hosting:** Vercel (despliegue continuo desde `main`)
- **Frontend + API:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Capa intermedia:** Route Handlers de Next.js (`app/api/*`) sobre Vercel Functions
- **Chatbot:** Motor de intents propio (sin dependencias externas en el MVP)
- **Datos:** API de consulta de expedientes del Despacho Presidencial + JSON estático del TUPA

## Equipo

OGTIC DP — Despacho Presidencial. Punto focal: German Canaza Torres.
