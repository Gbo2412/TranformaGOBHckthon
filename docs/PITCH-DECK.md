# Pitch Deck — Asistente DP

**Hackatón TRANSFORMAGOB 2026 · Desafío Despacho Presidencial**
Formato: revisión asíncrona del PPT por el jurado · video demo embebido · acceso a Vercel.

Contenido de las 11 slides listo para volcar a PowerPoint. Cada slide tiene **título-conclusión** (a usar como heading), **cuerpo** (a copiar como texto principal) y **nota de intención** (lo que defendemos, para tu referencia mientras armas — no va en la slide).

---

## Slide 1 — Cover

### Título
**Asistente DP — Kit conversacional para el Estado peruano**

### Subtítulo / bajada
> El Despacho Presidencial te responde a cualquier hora y donde estés.

### Cuerpo
- Logo / identidad del equipo
- URL: `https://tranforma-gob-hckthon.vercel.app`
- (Opcional) QR a la URL

### Nota de intención
Cover institucional con el hook como bajada. La URL debe estar visible aunque el juror no abra ninguna slide más.

---

## Slide 2 — TL;DR

### Título
**El lab pidió un chat. Entregamos un kit que replica ese chat en cualquier entidad en un día.**

### Cuerpo (dos columnas)

**EL DESAFÍO**
- Ciudadanos de provincia gastan S/350-700 y 2-4 días para consultar un expediente.
- 65% viene de fuera de Lima.
- 30% son consultas repetitivas.
- El lab pidió un chat 24/7.

**NUESTRA RESPUESTA**
- Un kit conversacional para el Estado peruano: agente + tools + plantillas + skills.
- Ya en producción contra la API real del DP, en español y quechua, embebible en cualquier sitio gob.pe.
- Replicable a otra entidad en un día.
- El núcleo es agnóstico al canal: hoy web · listo para WhatsApp, tótems, SMS y voz.

### Pie de slide
→ Demo en slide 5

### Nota de intención
Slide más rentable del deck para async. Si el juror lee solo esta, ya tiene 80% del argumento. Le devolvemos al lab su propia pregunta y mostramos que vamos más allá.

---

## Slide 3 — Problema + lo no nombrado por el lab

### Título
**El problema — y lo que el laboratorio no alcanzó a nombrar**

### Cuerpo (dos columnas)

**LO NOMBRADO POR EL LAB**
- 250 consultas/mes al DP
- 65% desde provincias
- 15 días de respuesta promedio
- 30% son repetitivas
- Puno: S/350-700 por consulta
- 50 ciudadanos viajan a Lima/mes

**LO NO NOMBRADO**
- Barrera lingüística (quechua y lenguas originarias)
- Calidad **superior** a la presencial, no solo equivalente
- Núcleo replicable a cualquier entidad y canal del Estado
- Agente conversacional real (no FAQ scripted)

### Cita al pie (en cursiva)
> "Trabajo todo el día y se me hace difícil acercarme a las oficinas para consultar mi expediente. Sería mucho más práctico revisar el estado de mi trámite desde mi celular, en cualquier momento."
> — Ciudadano, trabajo de campo OGTIC DP

### Nota de intención
Demuestra que leímos el desafío palabra por palabra. La columna derecha es el reframe que ataca el nivel 4 de Calidad.

---

## Slide 4 — La solución, en 90 segundos

### Título
**La solución, en 90 segundos**

### Cuerpo
- **Video demo embebido** (90 segundos)
- URL pública: `https://tranforma-gob-hckthon.vercel.app`
- Credenciales de prueba:
  - Expediente: `2026-0010582`
  - Clave: `4176`

### Nota de intención
Es la slide de la conversión visceral. El video debe mostrar: bienvenida con chips → "consultar mi expediente" → ingresar credenciales → resultado estructurado con chips → consulta TUPA SAIP → breve interacción en quechua.

---

## Slide 5 — Núcleo del kit

### Título
**El núcleo del kit: agnóstico al canal y a la entidad**

### Cuerpo (diagrama central)

```
┌──── ADAPTERS por canal (intercambiables) ────┐
│  Web · WhatsApp · Tótem · SMS · Voz          │
└──────────────────┬──────────────────────────┘
                   ▼
┌────────── NÚCLEO REUTILIZABLE ───────────────┐
│                                              │
│   Agente con tool use loop                   │
│   Tools intercambiables                      │
│       · consultar_expediente                 │
│       · obtener_tupa                         │
│       · enviar_resultado_por_correo          │
│       · (extensible)                         │
│   System prompt + plantillas + chips         │
│                                              │
└──────────────────┬──────────────────────────┘
                   ▼
┌──── CONFIG POR ENTIDAD (1 día) ─────────────┐
│  • DP_API_URL                                │
│  • tupa.json                                 │
│  • idioma(s) atendido(s)                     │
└──────────────────┬──────────────────────────┘
                   ▼
       API oficial de la entidad
       (Despacho Presidencial · RENIEC · etc.)
```

### Pie de slide
El núcleo es agnóstico al modelo: hoy usamos Claude Haiku 4.5; reemplazable por cualquier LLM open source (Llama, Mistral, DeepSeek) si el Estado prioriza soberanía digital o despliegue on-prem.

### Nota de intención
Slide para el juror técnico. El diagrama vende dos cosas a la vez: extensible por canal arriba, extensible por entidad abajo. El núcleo NO cambia.

---

## Slide 6 — Skills demostradas

### Título
**Skills demostradas hoy — todas vivas contra la API real del DP**

### Cuerpo (tabla)

| Skill | Qué hace | Prueba |
|---|---|---|
| 🔍 **Consultar expediente** | Tool use con API DP + manejo de errores en lenguaje humano. UTC → Lima. | Expediente `2026-0010582` · clave `4176` |
| 📋 **Información del TUPA** | Plantilla estructurada con DP-XXX, Plazo, Costo, Canal. | "requisitos del SAIP" |
| 🌐 **Quechua nativo** | Detección por palabras clave + plantillas traducidas. | "Allillanchu, willachikuyniyta munani" |
| 💬 **Chips contextuales** | Sugerencias post-respuesta gestionadas por el agente vía marcador interno. | Visible en cada respuesta estructurada |
| 🪟 **Embed iframe en cualquier sitio del Estado** | CSP abierto para integración en sitios gob.pe, intranets o tótems. | *(3 mockups pequeños de embeds en contexto)* |

### Nota de intención
La columna "Prueba" permite al juror validar cada skill yendo al Vercel sin pedir nada. Para skill 5 (embed) necesitas crear 3 mockups: widget en home gob.pe, fullscreen en tótem, dentro de intranet del DP.

---

## Slide 7 — Replicar en otra entidad

### Título
**Instanciar el kit en otra entidad: 3 archivos, 1 día**

### Cuerpo

```
PASO 1 — Cambiar el endpoint                            [≈ 30 min]
  DP_API_URL  →  endpoint de la nueva entidad

PASO 2 — Reemplazar los datos del TUPA                  [≈ 4 horas]
  tupa.json  →  trámites de la entidad

PASO 3 — Ajustar el system prompt                       [≈ 2 horas]
  nombre, mesa de partes, plantillas

PASO 4 — Probar contra usuarios reales                  [≈ 1 día]
  en una URL de Vercel preview
```

### Pie de slide
Aplicable a cualquier entidad del Estado con una API REST de seguimiento de trámites — el núcleo no cambia, solo la configuración.

El núcleo soporta adaptadores para WhatsApp, tótems y SMS sin modificar el agente. La voz requiere un adaptador adicional con ASR/TTS.

### Nota de intención
El paso a paso desarma el escepticismo: pone tiempos en horas, no en sprints. Suena real porque lo es.

---

## Slide 8 — Apertura, reutilización y ética digital

### Título
**Apertura, reutilización y ética digital**

### Cuerpo (dos columnas)

| Lo que hicimos | Norma que lo respalda |
|---|---|
| **1. Liberamos el núcleo como código abierto:** repo público con licencia MIT, documentación técnica completa (docs/ARCHITECTURE · AGENT · API · DEPLOYMENT) y workflow de PRs abiertos. Cualquier entidad puede clonarlo, adaptarlo y redistribuirlo. | **DL 1412 art. 29** (Reutilización de Software — "Software Público Peruano": usar · copiar · acceder al código · modificar · distribuir). |
| **2. Diseñamos el agente sin lock-in de proveedor.** Hoy usamos Claude Haiku 4.5; reemplazable por cualquier LLM open source (Llama, Mistral, DeepSeek) sin tocar el núcleo. | Refuerza DL 1412 art. 29 y abre la vía a soberanía digital: el Estado puede correr el kit con un LLM nacional, en su propia infraestructura. |
| **3. No persistimos la conversación ni los datos personales del ciudadano.** Sin logs de PII, sin third-party trackers, HTTPS obligatorio. La clave del expediente no se guarda en cliente ni en cookies. | **DL 1412 art. 5.3** ("Privacidad desde el Diseño") + **art. 5.10** y **Ley 29733** (Protección de Datos Personales). |
| **4. Construimos sobre estándares web abiertos** (REST, HTTP, HTML). Integramos con la API oficial del DP. El chat se embebe en cualquier sitio del Estado vía iframe. | **DL 1412 arts. 26-28** (Marco de Interoperabilidad del Estado Peruano — niveles organizacional, semántico, técnico y legal). |

### Pie de slide
→ El núcleo está legalmente listo para donarse al Estado o ser adoptado como recurso compartido por el ente rector del gobierno digital.

### Nota de intención
Slide de 20% de la rúbrica. Lideramos con verbos en pasado ("liberamos · diseñamos · no persistimos · construimos") — suena hecho, no prometido. Citamos artículos específicos para diferenciar de teams que solo dicen "open source".

---

## Slide 9 — Impacto cuantificable

### Título
**Impacto cuantificable**

### Cuerpo

**PARA EL CIUDADANO**

*Ciudadanos de provincias (50/mes — datos del desafío)*
- Pasajes ahorrados: **S/15.000 – 25.000 / mes**
- Días devueltos: **~125 días-ciudadano / mes**
- (Puno: S/700 + 4 días por viaje, caso extremo)

*Ciudadanos de Lima que evitan ir a Jr. de la Unión*
- Tiempo ahorrado: **~75 h ciudadano / mes**

*Consultas repetitivas resueltas en autoservicio (75/mes)*
- Tiempo del ciudadano: **~38 h / mes**

*Disponibilidad horaria*
- 40 h/semana → 24/7 (× 4.2)

---

**PARA EL DESPACHO PRESIDENCIAL**

75 consultas repetitivas/mes ahora se resuelven sin necesidad de un funcionario al teléfono o en ventanilla.
- Horas-funcionario disponibles: **~19 h / mes (~230 h / año)**

---

**PROYECCIÓN CONSERVADORA A 12 MESES (solo DP, sin replicar)**

- S/180.000 – 300.000 devueltos a ciudadanos en pasajes
- ~1.500 días-ciudadano liberados del traslado
- ~230 horas-funcionario disponibles para el resto del trabajo del DP

---

**INCLUSIÓN Y EQUIDAD** *(defendibles por código o ley)*

- **Quechua nativo** → cubre ~13% de la población (INEI 2017)
- **WCAG 2.1 AA** → adultos mayores y baja visión
- **24/7 sin sesgo** → consulta idéntica en Puno, Lima o Iquitos
- **Cero fricción** → sin login, sin app, sin formulario

### Nota de intención
Slide del valor público con números defendibles. Las métricas blandas del cierre son verificables con código o cita pública, no encuestas.

---

## Slide 10 — Continuidad institucional

### Título
**Continuidad institucional — de prototipo a servicio del Estado**

### Cuerpo

**INMEDIATAMENTE** *(post-hackatón, primer mes)*
- Pruebas con usuarios reales coordinadas por el lab DP (compromiso explícito del desafío)
- Integración Resend para envío real de correo (CU-06 completo)
- Restringir `frame-ancestors` a `*.gob.pe`
- Rate limiting básico
- Dominio custom: `asistente.presidencia.gob.pe`

**PUESTA EN PRODUCCIÓN INSTITUCIONAL** *(1-3 meses)*
- Migración de hosting a infraestructura del Estado si se prefiere on-prem (el kit lo soporta)
- Integración con el portal único gob.pe

**REPLICACIÓN A OTRAS ENTIDADES** *(3-12 meses)*
- Donación del kit a la entidad rectora del gobierno digital como recurso compartido del Estado (alineado con DL 1412 art. 29)
- Onboarding de primeras 2-3 entidades piloto con APIs REST
- Catálogo de skills reusables: agendar cita, subir documento, enviar SMS, ASR/TTS para voz

**GOBERNANZA Y MANTENIMIENTO**
- Repositorio público en GitHub, licencia MIT
- Documentación viva en `/docs`
- Workflow de PRs con revisión
- Mantenedores: equipo del proyecto en fase 1, transición a ente rector del gobierno digital en fase 2

### Nota de intención
Slide del 30% de Prototipo, criterio "ruta clara de continuidad institucional". La escalera de horizontes (1 mes, 1-3 meses, 3-12 meses, gobernanza) muestra un camino claro y verificable.

---

## Slide 11 — Mapeo a rúbrica + recursos

### Título
**Mapeo a la rúbrica + recursos para el jurado**

### Cuerpo (tabla)

| Criterio | Peso | Defendido en |
|---|---|---|
| **Calidad de la solución** *(nivel 4: quechua, replicabilidad, tool use)* | **35%** | Slides 2, 3, 4, 6 — Hook · Problema · Demo · Skills demostradas |
| **Prototipo / viabilidad** *(prueba viva en Vercel)* | **30%** | Slides 4, 5, 7, 10 — Demo · Núcleo · Replicar · Continuidad |
| **Apertura / reutilización / ética digital** *(Ley 29733, licencia MIT)* | **20%** | Slide 8 — DL 1412 art. 29 mapeado 1:1 a entregables |
| **Presentación y documentación** | **15%** | Todo el deck + carpeta `/docs` (ARCHITECTURE · AGENT · API · DEPLOYMENT · PRD · DESIGN) |

---

**RECURSOS**

| | |
|---|---|
| **Demo en vivo** | https://tranforma-gob-hckthon.vercel.app |
| **Credenciales prueba** | expediente `2026-0010582` · clave `4176` |
| **Repositorio** | https://github.com/Gbo2412/TranformaGOBHckthon |
| **Documentación** | `/docs` en el repositorio |

### Nota de intención
Regalo al juror: la cuadrícula resuelta para puntar criterio por criterio. Suma directo a "Presentación y documentación" (15%).

---

# Checklist antes de mandar el PPT

| # | Acción | Estado |
|---|---|---|
| 1 | Mergear el PR `chore/license-mit-readme` (LICENSE MIT + README raíz actualizado) | Pendiente |
| 2 | Confirmar que el repo `Gbo2412/TranformaGOBHckthon` está público | ✅ |
| 3 | Grabar video demo de 90 segundos (bienvenida → consultar expediente con credenciales → resultado con chips → consulta TUPA SAIP → breve interacción quechua) | Pendiente |
| 4 | Crear 3 mockups del embed para slide #6 (widget en gob.pe, tótem, intranet) | Pendiente |
| 5 | Probar Vercel desde un equipo limpio / incógnito | Pendiente |
| 6 | Captura de pantalla limpia del chat para cover (slide #1) | Pendiente |

---

# Identidad visual sugerida

Coherente con el sistema del chat (definido en `docs/DESIGN.md`):

- **Color institucional**: rojo gob.pe `#DC362E` (acentos) sobre fondo blanco `#FFFFFF` o gris muy claro `#F6F9FC`.
- **Acento conversacional / CTA**: azul gob.pe `#0056AC`.
- **Texto principal**: `#0D1028`.
- **Tipografía**: Inter (lo que usa la app) o cualquier sans humanista (Source Sans 3, IBM Plex Sans).
- **Cifras en negrita**: usar números tabulares para alinear (en PPT, "Old-style figures off / Tabular figures on").

---

# Pivotes argumentales del deck (resumen para recordar mientras armas)

1. **De "chatbot para DP" → a "kit conversacional para el Estado"** — ataca nivel 4 de Calidad (35%).
2. **Quechua pasó de titular → a prueba de extensibilidad** — más estratégico, menos vulnerable a "lo agregaste tarde".
3. **DL 1412 art. 29 mapeado 1:1 a entregables verificables** — asegura nivel 4 de Apertura (20%).
4. **Continuidad institucional con 4 horizontes** — cubre nivel 4 de Prototipo (30%).
5. **Mapeo a rúbrica como slide final** — facilita la puntuación al juror y suma para Presentación (15%).
