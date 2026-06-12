# Despacho Presidencial — Consulta de Expedientes 24/7

Solución para el Hackatón **TRANSFORMAGOB 2026** — Desafío OGTIC DP.

> ¿Cómo podríamos ayudar a los ciudadanos a saber el estado de sus expedientes y recibir orientación oportuna, sin acudir a ventanilla, sin importar el horario ni la ubicación?

## Propuesta

Plataforma web ligera (PWA) + chatbot conversacional (web y WhatsApp) que permite a cualquier ciudadano:

1. Consultar el estado de su expediente en tiempo real (expediente + clave).
2. Recibir orientación guiada sobre requisitos de trámites del TUPA.
3. Acceder desde cualquier dispositivo, sin instalar apps pesadas.

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

## Stack propuesto

- **Frontend:** Next.js 14 + Tailwind + shadcn/ui (accesible, AA WCAG)
- **Backend:** Node.js + Express + TypeScript
- **Chatbot:** Motor de intents propio + integración WhatsApp Business API
- **Datos:** Mock JSON provisto por el lab del DP

## Equipo

OGTIC DP — Despacho Presidencial. Punto focal: German Canaza Torres.
