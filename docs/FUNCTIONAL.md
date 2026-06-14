# Asistente DP — Documento Funcional

**Hackatón TRANSFORMAGOB 2026 · Despacho Presidencial**
Versión 1.0 · 2026-06-14

> El Estado peruano responde a cualquier hora, en cualquier lugar, en el idioma del ciudadano.

---

**Demo en vivo:** https://tranforma-gob-hckthon.vercel.app
**Credenciales de prueba:** expediente `2026-0010582` · clave `4176`
**Repositorio:** https://github.com/Gbo2412/TranformaGOBHckthon

---

## 1. El problema

Consultar el estado de un expediente ante el Despacho Presidencial hoy requiere:

| Ciudadano | Costo real |
|---|---|
| Rosa, de Puno | S/350–700 en pasajes + 2–4 días de viaje solo para saber si su solicitud avanzó |
| Luis, de Lima | Perder medio día de trabajo para ir a Jr. de la Unión en horario de oficina |
| Don José, 68 años | Depender de un familiar que lo acompañe y lo ayude a entender la respuesta |

**Los números del laboratorio del DP:**

- **250 consultas al mes** — el 65% viene de regiones fuera de Lima
- **15 días hábiles** de tiempo promedio de respuesta por canal presencial
- **30% de consultas son repetitivas** — el mismo ciudadano vuelve a preguntar por el mismo expediente

Y hay un problema que los datos no capturan: **la barrera del idioma**. Más de 3,7 millones de peruanos tienen el quechua como lengua materna (INEI 2017). Cuando llegan a la ventanilla o al teléfono, el sistema los atiende en español. La brecha no es geográfica: es lingüística.

---

## 2. La solución

El **Asistente DP** es un agente conversacional que permite a cualquier ciudadano consultar el estado de su expediente, conocer los requisitos de un trámite y resolver sus dudas sobre el Despacho Presidencial — **desde su celular, en menos de 60 segundos, sin formularios, sin horarios de oficina, sin instalar nada**.

La interfaz es una sola pantalla de chat. No hay menús, no hay páginas separadas, no hay formularios. El ciudadano simplemente escribe, como si le enviara un mensaje a alguien de confianza — y el agente responde con información real, obtenida en tiempo real de la API oficial del Despacho Presidencial.

```
┌─────────────────────────────────────────────┐
│  🏛 DESPACHO PRESIDENCIAL                   │
│  Asistente de expedientes                   │
├─────────────────────────────────────────────┤
│                                             │
│  Hola, soy el Asistente DP. Puedo          │
│  ayudarte con:                              │
│  · El estado de tu expediente               │
│  · Información sobre trámites               │
│  · Consultas sobre el Despacho              │
│                                             │
│  [Consultar expediente] [Ver trámites]      │
│  [Otra consulta]                            │
│                                             │
├─────────────────────────────────────────────┤
│  Escríbele al asistente...          [→]     │
└─────────────────────────────────────────────┘
```

---

## 3. Flujos principales

### 3.1 Consulta de expediente

El ciudadano no necesita saber cómo se llama la herramienta ni qué formato tiene el número. Solo cuenta qué necesita:

```
Ciudadano:   "quiero saber si mi expediente avanzó"

Asistente:   Para consultarlo necesito dos datos:
             · Número de expediente (ej: 2026-0010582)
             · Clave numérica de acceso

Ciudadano:   "2026-0010582, mi clave es 4176"

Asistente:   Aquí está el estado de tu expediente:
             ─────────────────────────────────────
             Número    · 2026-0010582
             Trámite   · Solicitud de Audiencia Presidencial
             Titular   · Quispe Mamani Rosa Elena
             Estado    · En proceso
             Detalle   · Su expediente se encuentra en evaluación
             Última actualización · hoy a las 12:53
             Tiempo estimado · 5 días hábiles
             ─────────────────────────────────────
             También puedo explicarte qué significa
             este estado o ayudarte con otro trámite.

             [Envíamelo por correo]
             [¿Qué significa este estado?]
             [Consultar otro expediente]

Ciudadano:   [toca el chip "Envíamelo por correo"]

Asistente:   Para enviarte el resumen por correo,
             necesito tu dirección de email. ¿Cuál es?

Ciudadano:   "rosa.quispe@gmail.com"

Asistente:   Listo, te envié el resumen a
             rosa.quispe@gmail.com.
```

El agente llama a la API oficial del DP en tiempo real. La fecha se convierte automáticamente de UTC a hora de Lima antes de mostrarse. Los errores (expediente inexistente, clave incorrecta, sistema caído) se comunican en lenguaje humano, nunca con códigos.

---

### 3.2 Información de trámites (TUPA)

El ciudadano no necesita conocer los códigos del TUPA. Pregunta como preguntaría en una ventanilla:

```
Ciudadano:   "quiero pedir información pública al Despacho,
              ¿qué necesito?"

Asistente:   DP-002 · Solicitud de Acceso a la Información Pública (SAIP)

             Permite solicitar información pública que posea
             el Despacho Presidencial.
             ─────────────────────────────────────
             Requisitos
             · Nombres y apellidos completos
             · DNI y domicilio
             · Descripción concreta del pedido
             · Modalidad de entrega preferida
             · Firma o huella (solo si es presencial)

             Plazo   · 10 días hábiles desde el día siguiente
             Silencio administrativo · Negativo
             Costo   · Gratuito · Reproducción: A4 S/0.10 · CD S/1.00
             Canal   · Presencial o accesoinf@presidencia.gob.pe
             ─────────────────────────────────────
             [⬇ Descargar el formulario]
             [Ver Solicitud Simple] [Ver Reclamo]
             [Consultar mi expediente]
```

El chip **⬇ Descargar el formulario** abre directamente el formulario oficial del SUT (PCM) en una pestaña nueva — sin hacer ninguna consulta al agente. Cero latencia, cero tokens, funciona incluso si el agente está ocupado.

Los tres trámites disponibles son:

| Código | Trámite | Plazo | Costo |
|---|---|---|---|
| DP-001 | Solicitud Simple | 30 días hábiles | Gratuito |
| DP-002 | Acceso a la Información Pública (SAIP) | 10 días hábiles | Gratuito (reproducción con costo mínimo) |
| DP-003 | Reclamo | 30 días hábiles | Gratuito |

---

## 4. Accesibilidad ciudadana

El diseño de esta solución parte de un principio: **un servicio digital que solo funciona para algunos, no es un servicio público**. La accesibilidad no es un feature — es el fundamento.

### 4.1 Atención completa en quechua (runasimi)

El Asistente DP es el primer canal digital del Despacho Presidencial que atiende a ciudadanos quechuahablantes en su idioma, sin intermediarios.

Cuando el ciudadano escribe en quechua, el agente detecta el idioma y responde **completamente** en quechua — no solo saluda en quechua y contesta en español. Todos los mensajes del asistente, incluyendo instrucciones, preguntas de seguimiento, confirmaciones y errores, son en runasimi.

```
Ciudadano:   "Rimaykullayki, willachikuyniyta maskhayta munani"

Asistente:   Allinllachu, rimaykullayki.
             Ñoqa Asistente DP kachkani.
             Imaynatan yanapaymanki?

Ciudadano:   "Willachikuy numeroy 2026-0010582 clavey 4176"

Asistente:   Kaypi willachikuyniyki estado:
             ─────────────────────────────────────
             Número    · 2026-0010582
             Trámite   · Solicitud de Audiencia Presidencial
             Titular   · Quispe Mamani Rosa Elena
             Estado    · En proceso
             Detalle   · Su expediente se encuentra en evaluación
             Tiyay     · hoy a las 12:53
             Tiempo    · 5 días hábiles
```

El agente maneja naturalmente los sufijos gramaticales del quechua: si el ciudadano escribe "numeroy" o "clavey" (con el sufijo posesivo `-y`), extrae los números correctamente y llama a la herramienta sin pedirle al ciudadano que cambie su forma de escribir.

Los datos que devuelve la API oficial (nombres, fechas, estados) pueden quedar en español por ser registros oficiales, pero **todas las palabras del asistente son en quechua**.

**Cobertura:** El quechua es la lengua materna de aproximadamente 3,7 millones de peruanos (INEI 2017) — el 13% de la población. La mayoría vive en regiones andinas como Cusco, Apurímac, Ayacucho, Huancavelica y Puno: exactamente el público que más necesita este canal.

---

### 4.2 Derivación en aymara

Para ciudadanos que escriben en aymara, el asistente responde en ese idioma con el teléfono de atención directa del Despacho Presidencial:

> *"Janiw aka sistema aymara arustayañatakix wakicht'askiti. Yanapt'añatakix 311-3900 Anexo 5980 ukaruw arst'asma."*

El aymara es hablado principalmente en Puno, donde la presencia de ciudadanos con expedientes en el DP es significativa.

---

### 4.3 Diseño para todos

| Principio | Implementación |
|---|---|
| **Mobile-first** | Diseñado para celulares de gama media con conexión 3G — el hardware más común en provincias |
| **WCAG 2.1 AA** | Contraste mínimo 7:1 en texto principal, área de toque ≥ 44px, lector de pantalla compatible |
| **Sin instalación** | Funciona desde el navegador del celular, sin descargar app |
| **Sin login** | No requiere cuenta, DNIe ni datos previos — solo el número y clave del expediente |
| **Lenguaje claro** | Cero jerga administrativa; los errores se explican en palabras simples |
| **Adultos mayores** | Tipografía Inter ≥ 16px, burbujas amplias, mensajes breves y directos |
| **Sin formularios** | Todo va por conversación — no hay campos que llenar ni pasos que seguir |
| **Embebible** | Puede integrarse como iframe en cualquier sitio del Estado sin configuración adicional |

---

## 5. Cómo funciona (arquitectura funcional)

```
El ciudadano escribe desde su celular
            │
            ▼
    Chat en el navegador
    (Next.js · Vercel)
            │
            ▼
    Agente conversacional
    (Claude Haiku 4.5)
            │
     ┌──────┴──────┬──────────────────┐
     ▼             ▼                  ▼
  Consulta      Base de           Envío de
  expediente    conocimiento      correo
  (API real     (TUPA con         (Gmail API
   del DP)       3 trámites)       OAuth2)
     │
     ▼
  Respuesta en lenguaje natural
  con datos reales, en español o quechua
```

El agente decide por sí solo qué herramienta usar según lo que el ciudadano describe. No hay menús que navegar, no hay rutas predefinidas: el ciudadano dice lo que necesita y el agente actúa.

**Datos siempre reales:** la información del expediente viene de la API oficial del Despacho Presidencial en cada consulta. No hay caché de estados, no hay datos falsos.

**Seguridad:** la clave del expediente nunca se guarda — ni en el cliente, ni en cookies, ni en logs. La conversación existe solo en la memoria del navegador durante la sesión.

---

## 6. Lo que diferencia esta solución

### Quechua nativo — no traducción automática

La atención en quechua no está implementada con un traductor externo. El agente fue entrenado con reglas lingüísticas específicas del runasimi: vocabulario de señales, sufijos gramaticales (`-yki`, `-yta`, `-yuq`), desambiguación de prefijos (`ama` es quechua, no aymara), y plantillas de respuesta canónicas para los escenarios más comunes. El resultado es una experiencia coherente, no una traducción literal que suene extraña.

### Action chips — acciones instantáneas

Los chips que aparecen debajo de cada respuesta no son solo sugerencias de texto. Algunos — como **⬇ Descargar el formulario** — son acciones directas: el frontend las ejecuta sin pasar por el agente. Esto significa que el ciudadano puede descargar el formulario oficial del SAIP incluso si el agente está ocupado o la conexión es lenta.

### Un kit, no un chatbot

El núcleo de este sistema — el agente, las herramientas, el prompt, los chips — está diseñado para ser replicable. Adaptar la solución a otra entidad del Estado requiere cambiar tres archivos:

```
1. DP_API_URL     → endpoint de la nueva entidad          (30 min)
2. tupa.json      → trámites de la entidad                ( 4 h )
3. prompt.ts      → nombre, mesa de partes, plantillas    ( 2 h )
```

El modelo de lenguaje también es intercambiable: hoy usa Claude Haiku 4.5 por su velocidad y costo; puede reemplazarse por cualquier modelo open source (Llama, Mistral, DeepSeek) si el Estado prioriza soberanía digital o despliegue en su propia infraestructura.

### Alineado con el marco legal vigente

| Entregable | Norma |
|---|---|
| Código abierto (MIT), documentación completa, repositorio público | DL 1412 art. 29 — Software Público Peruano |
| Sin lock-in de proveedor; modelo de lenguaje intercambiable | DL 1412 art. 29 — Soberanía digital |
| No se persisten datos personales ni conversaciones | DL 1412 art. 5.3 + Ley 29733 — Protección de Datos |
| Integración con API REST oficial del DP | DL 1412 arts. 26–28 — Marco de Interoperabilidad |

---

## 7. Estado actual

| Funcionalidad | Estado | Probar con |
|---|---|---|
| Consulta de expediente en tiempo real | ✅ En producción | Exp. `2026-0010582` · Clave `4176` |
| Información de trámites TUPA (3 trámites) | ✅ En producción | "¿qué necesito para el SAIP?" |
| Orientación general (horarios, mesa de partes, estados) | ✅ En producción | "¿dónde queda mesa de partes?" |
| Atención completa en quechua | ✅ En producción | "Rimaykullayki, munani yanapawankichu" |
| Derivación en aymara | ✅ En producción | "Kamisaraki" |
| Chips contextuales y action chips | ✅ En producción | Visible después de cada respuesta |
| Descarga del formulario SAIP | ✅ En producción | Chip "⬇ Descargar el formulario" tras consultar DP-002 |
| Embed por iframe en otros sitios | ✅ En producción | `<iframe src="https://tranforma-gob-hckthon.vercel.app">` |
| Manejo de errores en lenguaje humano | ✅ En producción | Clave incorrecta, expediente inexistente |
| Chip "Envíamelo por correo" tras resultado | ✅ En producción | Aparece automáticamente tras consultar expediente |
| Envío de correo real (Gmail OAuth2) | ✅ En producción | Remitente: `asistente.de.despacho.hackaton@gmail.com` |
| Accesibilidad WCAG 2.1 AA | ✅ En producción | Navegación por teclado, lector de pantalla |

**Pendiente para producción real:**

| Tarea | Impacto |
|---|---|
| Rate limiting en `/api/chat` | Protección contra abuso a escala |
| Restringir `frame-ancestors` a `*.gob.pe` | CSP correcto para sitios del Estado |

---

## 8. Impacto

### Para el ciudadano

| Segmento | Beneficio |
|---|---|
| 50 ciudadanos que viajan desde provincias/mes | S/17.500–35.000 devueltos en pasajes · ~125 días-ciudadano liberados |
| Ciudadanos que van presencialmente desde Lima | ~75 horas ahorradas / mes |
| 75 consultas repetitivas/mes | Resueltas en autoservicio, sin esperar turno |
| Quechuahablantes | Primera atención digital completa en su idioma — sin intermediarios |
| Disponibilidad | 40 h/semana de atención presencial → 168 h/semana (24/7) |

### Para el Despacho Presidencial

- **~230 horas-funcionario disponibles por año** al resolver en autoservicio el 30% de consultas repetitivas
- Atención de calidad uniforme: la misma respuesta a las 2 AM en Puno que a las 10 AM en Lima
- Canal embebible en el portal del DP sin infraestructura adicional

### Proyección a 12 meses (solo DP, sin replicar a otras entidades)

- S/180.000–300.000 devueltos a ciudadanos en pasajes ahorrados
- ~1.500 días-ciudadano liberados del traslado
- Cobertura efectiva para el 13% de la población con quechua como lengua materna

---

## 9. Hoja de ruta

**Inmediato (post-hackatón, primer mes)**
- Rate limiting básico por IP
- Restricción de iframe a `*.gob.pe`
- Dominio personalizado: `asistente.presidencia.gob.pe`

**Puesta en producción institucional (1–3 meses)**
- Pruebas con usuarios reales coordinadas por el laboratorio del DP
- Streaming de respuestas (Server-Sent Events) para percepción de velocidad
- Migración de hosting a infraestructura del Estado si se prefiere on-prem

**Replicación a otras entidades (3–12 meses)**
- Donación del kit al ente rector del gobierno digital como recurso compartido (DL 1412 art. 29)
- Onboarding de primeras 2–3 entidades piloto (PCM, ministerios con APIs REST)
- Expansión de lenguas originarias: más variedades del quechua, shipibo-konibo, aimara completo
- Catálogo de skills reutilizables: agendar cita, subir documento, ASR/TTS para voz

---

*Documentación técnica completa: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`AGENT.md`](./AGENT.md) · [`API.md`](./API.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)*
*Documento de producto: [`PRD.md`](./PRD.md) · Sistema visual: [`DESIGN.md`](./DESIGN.md)*