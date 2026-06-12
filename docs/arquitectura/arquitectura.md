# Arquitectura — DP Consulta 24/7

## Diagrama de alto nivel

```
   Ciudadano
   ┌────────┐
   │ Web PWA│◀──┐
   └────────┘   │           ┌────────────────┐      ┌──────────────────┐
   ┌────────┐   ├──HTTPS──▶│  API Backend   │─────▶│ API Expedientes  │
   │WhatsApp│◀──┘           │  (Node/Express)│      │ (Despacho Presid)│
   └────────┘                └────┬───────────┘      └──────────────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │ Motor Chatbot│
                          │ (intents+NLP)│
                          └──────────────┘
```

## Componentes

- **Frontend PWA**: instalable opcional, funciona offline para consultas previas.
- **Backend API**: orquesta llamadas a la API real de expedientes del DP.
- **Chatbot**: intents para consulta, orientación TUPA, derivación humana.
- **Canal WhatsApp**: WhatsApp Business API para llegar al 65% de usuarios de provincias.

## Cumplimiento

- Ley de Gobierno Digital — interoperabilidad, accesibilidad, seguridad.
- Alineamiento con TUPA del Despacho Presidencial.
- Cifrado en tránsito (TLS) y autenticación expediente+clave.
