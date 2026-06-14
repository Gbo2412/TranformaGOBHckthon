# Sistema Visual y Accesibilidad — Asistente DP

**Versión 2.1 · 2026-06-13**
Basado en PRD v3.0 (chat-only) y en la paleta oficial del Sistema de Diseño del Estado Peruano ([gob.pe](https://guias.servicios.gob.pe/creacion-servicios-digitales/estilos/colores)).

> **Changelog v2.1:** Documenta el pulido visual del PR `feat/look-feel-pro`: header con backdrop-blur + elev-bar, avatar con ring institucional, burbujas con elevación sutil, chips con lift en hover + scale en active, botón Enviar con press feedback, input con focus ring expandido, sistema de animación (`msg-enter`, `typing-pulse`) y sistema de elevación de 3 niveles. Nuevas secciones §5.2b (avatar en burbuja), §5.11 (action chips), §5.12 (elevación), §5.13 (animación), §5.14 (tipografía refinada). Incluye footer con safe-area-inset-bottom (iPhone gesture bar).
>
> **Changelog v2.0:** Documenta lo que efectivamente está en producción. Agregadas §5.9 (chips contextuales) y §5.10 (markdown rendering). §8 matriz de estados actualizada al comportamiento real. §9 marcado como completado.

---

## 1. Principios rectores

1. **Una conversación, una pantalla.** Toda la interfaz es el chat. No tabs, no sidebars, no modales.
2. **Confianza institucional sin solemnidad.** Lenguaje claro y cálido; estética del Estado peruano (rojo gob.pe como ancla de identidad), pero con respiración tipo apps modernas de mensajería.
3. **Mobile-first, 3G-tolerante.** El 65% de los usuarios vienen de regiones; optimizamos para celulares de gama media.
4. **Accesibilidad WCAG 2.1 AA como mínimo.** Pensamos en adultos mayores y baja alfabetización digital desde el primer pixel.
5. **Foco en el contenido del mensaje, no en el envoltorio.** El chrome es discreto; el contenido respira.

---

## 2. Sistema de color

### 2.1 Paleta base (heredada de gob.pe)

| Token | Hex | Uso |
|---|---|---|
| `--color-brand-700` | **#DC362E** | Color institucional principal. Header, énfasis, brand. |
| `--color-brand-800` | **#BF0909** | Estados activos del brand (hover de header, focus rings). |
| `--color-brand-50`  | **#FCEEEE** | Fondo sutil de superficies con énfasis brand (no usado en chat MVP). |

> Decisión: el **rojo gob.pe es el ancla institucional** (se ve en header y CTA principal), pero **no es el color de las burbujas del usuario**. Saturarlo en la conversación cansa la vista. Para las burbujas del usuario usamos azul gob.pe — sigue siendo Estado peruano, pero respira.

### 2.2 Tokens semánticos del chat

| Token | Hex | Uso |
|---|---|---|
| `--surface-page` | **#F6F9FC** (N100) | Fondo de toda la app. |
| `--surface-card` | **#FFFFFF** (G100) | Burbujas del asistente, header, input bar. |
| `--surface-muted` | **#EEF3FB** (B300/N250) | Quick reply chips, divisores sutiles. |
| `--text-primary` | **#0D1028** (N800) | Texto principal. Contraste 17.1:1 sobre blanco ✅ AAA. |
| `--text-secondary` | **#3D4053** (N700) | Texto secundario, microcopy. Contraste 11.6:1 ✅ AAA. |
| `--text-muted` | **#555869` (N600) | Placeholders, timestamps, hints. Contraste 7.4:1 ✅ AAA. |
| `--border-default` | **#DEE3EA** (N300) | Bordes de input y burbujas del asistente. |
| `--accent-user` | **#0056AC** (B700) | **Burbujas del usuario**. Contraste con blanco 7.2:1 ✅ AAA. |
| `--accent-user-hover` | **#184397** (B800) | Hover/active del CTA principal. |
| `--success` | **#1B9D6B** (G700) | Estados resueltos / confirmaciones (envío de correo OK). |
| `--warning` | **#FF6701** (O700) | Estados en proceso, advertencias suaves. |
| `--danger` | **#BF0909** (R800) | Errores duros. |
| `--focus-ring` | **#1363D0** (B650), 3px | Anillo de foco visible en TODO elemento interactivo. |

### 2.3 Mapeo a estados del expediente (CU-02)

Cuando el agente reporta el estado, el badge se colorea así (presentado en el texto del mensaje del asistente, no como elemento decorativo separado):

| Estado | Token | Hex texto / fondo |
|---|---|---|
| `DOCUMENTO REGISTRADO` | info | texto #184397 / fondo #EEF3FB |
| `EN PROCESO` | warning | texto #D75600 / fondo #FFF3EA |
| `SE EMITIÓ RESPUESTA` | success | texto #126B49 / fondo #E3F3EC |
| `RECHAZADO` | danger | texto #BF0909 / fondo #FCEEEE |

### 2.4 Modo oscuro

**Fuera de scope para el MVP.** Documentado para fase 2: invertir surfaces a N800/N700 y revisar contraste de R700.

---

## 3. Tipografía

### 3.1 Familia

- **Primary**: `Inter` (Google Fonts), cargada vía `next/font/google` con `display: swap`.
- **Fallback stack**: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Razón**: Inter tiene optical sizing pensado para UI, dígitos tabulares (útil para números de expediente), y excelente legibilidad en pantallas pequeñas. Es el estándar de facto en gov-tech moderno.

### 3.2 Escala (mobile-first)

| Token | Tamaño / Line-height | Peso | Uso |
|---|---|---|---|
| `text-xs` | 12px / 16px | 500 | Timestamps, microcopy de disclaimer |
| `text-sm` | 14px / 20px | 500 | Quick replies, labels |
| `text-base` | **16px / 24px** | 400 | **Cuerpo del chat (default)** — mínimo accesible |
| `text-lg` | 18px / 28px | 600 | Título del header del chat |
| `text-xl` | 20px / 28px | 700 | Mensajes de bienvenida destacados |

> Regla: nunca menos de 16px en el cuerpo del chat. Para adultos mayores, considerar control de tamaño de texto del navegador con `rem` (que ya usa Tailwind por default).

### 3.3 Cifras

- **Números de expediente y claves**: `font-variant-numeric: tabular-nums` para alinear dígitos.
- **Estados (badges)**: `text-transform: none` — el agente los devuelve en formato natural ("En proceso"), no `EN PROCESO` en gritado.

---

## 4. Espaciado y layout

### 4.1 Grid

- **Container del chat**: `max-w-[680px]` (~42rem). En móvil ocupa 100% del ancho con padding lateral de 16px.
- **Scale de spacing**: múltiplos de 4px (default Tailwind). Padding interno de burbujas: 12px vertical, 16px horizontal.
- **Altura del viewport**: usar `100dvh` (dynamic viewport height) para que la URL bar de mobile no rompa el layout.

### 4.2 Anatomía de la pantalla

```
┌─────────────────────────────────────┐
│  Header (sticky top, 56px)          │  ← rojo brand-700, logo DP, título
├─────────────────────────────────────┤
│                                     │
│  Mensajes (scroll vertical)         │
│  ┌───────────────────────────┐      │
│  │  Burbuja asistente         │     │
│  └───────────────────────────┘      │
│       ┌──────────────────────────┐  │
│       │ Burbuja usuario          │  │
│       └──────────────────────────┘  │
│                                     │
│  [Quick reply chips] (solo turn 1)  │
│                                     │
├─────────────────────────────────────┤
│  Input bar (sticky bottom)          │  ← textarea + botón Enviar
│  Disclaimer microcopy               │
└─────────────────────────────────────┘
```

### 4.3 Burbujas

- **Asistente**: alineadas a la izquierda, fondo `surface-card`, borde `border-default`, esquinas redondeadas `rounded-2xl` excepto la inferior izquierda (`rounded-bl-md`). Max-width 85%.
- **Usuario**: alineadas a la derecha, fondo `accent-user`, texto blanco, esquinas `rounded-2xl` excepto la inferior derecha (`rounded-br-md`). Max-width 85%.
- **Sistema (errores / éxito de envío)**: centrada, fondo `surface-muted`, texto `text-secondary`, sin avatar. Max-width 100%.

### 4.4 Avatar del asistente

- Círculo 32px, fondo `brand-700`, monograma "DP" en blanco bold.
- Aparece **solo en el primer mensaje** de cada secuencia consecutiva del asistente (evita ruido visual).

---

## 5. Componentes

### 5.1 Header

- **Estructura**: avatar (40px) + grupo `(eyebrow "DESPACHO PRESIDENCIAL" + título "Asistente de expedientes")`.
- **Color**: fondo `surface-card/95` con `backdrop-blur` y sombra de barra `.elev-bar` (ver §5.13). El rojo institucional aparece solo en el avatar — no como fondo lleno.
- **Avatar**: círculo `brand-700` con monograma "DP" + `ring-1 ring-brand-800/20` (microhalo institucional).
- **Eyebrow**: `text-[11px]` semibold uppercase + `tracking-[0.08em]` — más editorial que `text-xs` plano.
- **Comportamiento**: sticky top, no se oculta al scrollear (anchor de identidad). Al hacer scroll el contenido pasa por debajo de la barra translúcida.

### 5.2 Burbuja del asistente

- Texto en `text-base` (16px), `text-primary`, `leading-relaxed` para respiración.
- Soporte de salto de línea (`whitespace-pre-wrap`).
- **Elevación**: `.elev-1` (sombra muy sutil) en lugar de `shadow-sm` plano. Las burbujas "respiran" sobre el fondo sin saturarse.
- **Entrada animada**: cada burbuja monta con la clase `.msg-enter` (ver §5.14).
- Si contiene un **estado de expediente**, renderizar con badge inline coloreado según §2.3.
- Si contiene una **dirección o correo**, hacerlo `<a>` con focus ring.

### 5.2b Avatar del asistente (en burbuja)

- Círculo 32px, `bg-brand-700` + `ring-1 ring-brand-800/20`.
- Mismo microhalo institucional que el avatar del header.
- Render condicional: aparece solo en el primer mensaje de cada secuencia consecutiva del asistente (evita ruido visual).

### 5.3 Burbuja del usuario

- Texto blanco sobre `accent-user`. Probado: ratio 7.2:1 (AAA).

### 5.4 Quick reply chips (turn 1) y chips contextuales

- Pills horizontales, fondo `bg-surface-card` (blanco) sobre el fondo claro de la página — se ven como piezas físicas, no como botones embebidos.
- Borde `border-line` 1px.
- **Hover**: `-translate-y-px` + `hover:shadow-sm` + borde y texto pasan a `brand-700`. Sensación táctil de "se levanta".
- **Active**: `scale-[0.98]` para press feedback inmediato.
- **Transición**: 150ms en `all` para que ambas micro-interacciones se sientan fluidas.
- **Focus**: anillo `focus-ring`, 3px, offset 2px.
- **Tamaño**: `min-h-[44px]` siempre (área de toque accesible en móvil y desktop).
- Texto del turn 1 (`WELCOME_CHIPS`):
  - "Consultar el estado de un expediente"
  - "Conocer sobre un trámite"
  - "Otra consulta sobre el Despacho Presidencial"

### 5.5 Indicador "el asistente está escribiendo"

- Tres dots pequeños (`h-1.5 w-1.5`) dentro de una burbuja del asistente vacía con `.elev-1`.
- Animación `.typing-pulse` (escala + opacidad) con delays 0s · 0.15s · 0.3s. Más elegante que el `animate-bounce` anterior — estilo iMessage / Linear / Claude.app.
- Etiqueta accesible: `aria-label="El asistente está escribiendo"` en el contenedor + `aria-live="polite"`.
- Tiempo máximo visible antes de timeout: 30s.
- Respeta `prefers-reduced-motion` (la animación se desactiva).

### 5.6 Input bar

- **Container**: fondo `surface-card/95` con `backdrop-blur` y `pb-[max(0.75rem,env(safe-area-inset-bottom))]` para respetar la home indicator de iPhone (gesture bar).
- **Textarea autoexpansible** (max 4 líneas, después scroll interno).
- Placeholder: "Escríbele al asistente…"
- **Focus del textarea**: borde pasa a `accent-user` + halo suave `ring-4 ring-accent-user/15`. Transición 150ms — focus visible y elegante, no agresivo.
- **Botón Enviar**:
  - Estado normal: fondo `accent-user`, texto blanco, `rounded-full`, 44×44px (h-11).
  - **Active**: `scale-[0.97]` — press feedback uniforme con los chips.
  - Disabled (input vacío o cargando): opacity 50%, cursor not-allowed, sin scale.
  - `aria-label="Enviar mensaje"`.
- **Tecla Enter** envía; **Shift+Enter** hace salto de línea.
- **Disclaimer debajo**: "No compartas datos personales más allá de los necesarios para tu consulta." — `text-xs`, `text-muted`.

### 5.7 Errores conversacionales

El agente nunca muestra códigos HTTP. Los errores se entregan como mensajes del asistente con tono humano:

- **404 (expediente no encontrado)**: "No encontré el expediente con ese número. ¿Puedes verificarlo en tu comprobante? Si necesitas ayuda, mesa de partes está en Jr. de la Unión 264, Cercado de Lima."
- **401 (clave incorrecta)**: "La clave no coincide con ese expediente. ¿Quieres intentar de nuevo?"
- **502 (API caída)**: "El sistema del Despacho Presidencial no está respondiendo en este momento. Por favor, intenta de nuevo en unos minutos."
- **Sin red**: mensaje del frontend, ya implementado.

### 5.8 Envío de correo (CU-06)

Cuando el agente confirma envío exitoso, se muestra una **burbuja sistema** centrada:

```
┌──────────────────────────────────────────┐
│  ✓ Resultado enviado a tu_correo@…       │
└──────────────────────────────────────────┘
```

- Fondo `success` al 10% (#E3F3EC), texto `success`, borde 1px del mismo color.
- Ícono de check (SVG inline, no librería).

### 5.11 Action chips (chips de acción directa)

Chips que el frontend intercepta y resuelve **sin pasar por el agente**: el ciudadano hace click, el front abre la URL en una pestaña nueva, y la conversación no se interrumpe. Cero round-trip con el modelo, cero tokens, cero latencia.

**Implementación**: mapa `CHIP_ACTIONS` en `frontend/src/components/Chat.tsx`. Detallado en [`AGENT.md §6`](./AGENT.md#action-chips-interceptados-por-el-front).

**Caso vivo hoy**: `⬇ Descargar el formulario` después de la plantilla DP-002 (SAIP). Abre el PDF del SUT en pestaña nueva.

**Visual**: idéntico al resto de chips contextuales (§5.4) — el ciudadano no necesita distinguir visualmente entre conversacional y acción directa. La diferencia está solo en el comportamiento del click.

### 5.12 Sistema de elevación

Tres niveles de sombras institucionales muy sutiles, definidas como CSS variables y expuestas como utilidades en `globals.css`:

| Token | Variable | Utilidad | Uso |
|---|---|---|---|
| Elevation 1 | `--shadow-elev-1` | `.elev-1` | Burbujas (asistente, usuario), typing bubble. Da "respiración" sobre el fondo. |
| Elevation 2 | `--shadow-elev-2` | `.elev-2` | (Reservado para modales o cards destacados — no en uso hoy.) |
| Bar | `--shadow-bar` | `.elev-bar` | Header sticky. Profundidad sutil al hacer scroll sin saturar. |

Las sombras combinan dos capas (offset 1-4px + radio 12-16px) y usan `rgba(13, 16, 40, 0.04–0.08)` para mantenerse neutras y respetar el color base de la página.

### 5.13 Sistema de animación

Animaciones de UI definidas en `globals.css` como keyframes nombradas. Todas respetan `prefers-reduced-motion` (se desactivan automáticamente).

| Animación | Cuándo | Detalle |
|---|---|---|
| `msg-enter` | Cada burbuja nueva (usuario, asistente, sistema), typing bubble, ChipsRow. | Slide-up 6px + fade en 240ms con curva `cubic-bezier(0.2, 0.7, 0.2, 1)`. Aplicada con la clase `.msg-enter`. |
| `typing-pulse` | Los 3 dots del indicador "escribiendo". | Pulse de opacidad (0.25 → 1 → 0.25) + escala (0.85 → 1 → 0.85) en 1.2s ease-in-out infinite. Reemplaza al `animate-bounce` anterior. |

Las micro-interacciones de hover/active (chips, botón Enviar) usan transiciones Tailwind inline (`transition-all duration-150` + `active:scale-[0.97]` o `[0.98]`) y no requieren keyframes propias.

### 5.14 Tipografía refinada

Inter cargada con `next/font/google` + `font-feature-settings: "cv11", "ss01", "ss02", "cv01", "cv02"` y `text-rendering: optimizeLegibility` en `body`. Activa estilos contextuales de Inter para mejor kerning y formas alternativas en peso semibold y signos. Pequeño cambio, gran ganancia visual.

---

## 6. Accesibilidad — checklist obligatorio

### 6.1 Texto y contraste

- [ ] **Contraste mínimo 4.5:1** en todo texto cuerpo (cumplido por defecto con tokens definidos).
- [ ] **Contraste 3:1** en componentes UI (bordes de input, ícono del botón).
- [ ] Tamaño de texto cuerpo ≥ 16px.
- [ ] Sin texto en imágenes; todo es HTML.

### 6.2 Navegación por teclado

- [ ] **Orden de tab lógico**: input → botón Enviar → quick replies (si visibles).
- [ ] **Focus visible** en TODO interactivo (anillo `focus-ring` 3px).
- [ ] **Esc** no cierra nada (no hay modales).
- [ ] **Enter** envía mensaje; **Shift+Enter** salta línea.

### 6.3 Lector de pantalla

- [ ] `<html lang="es">` definido en `layout.tsx` ✅.
- [ ] Contenedor de mensajes con `role="log"` + `aria-live="polite"` para anunciar nuevos turnos del asistente sin interrumpir.
- [ ] Cada burbuja del asistente: `aria-label="Mensaje del asistente"`. Cada burbuja del usuario: `aria-label="Tu mensaje"`.
- [ ] Botón Enviar: `aria-label="Enviar mensaje"` cuando es icon-only.
- [ ] Indicador "escribiendo": `aria-live="polite"` con `aria-label="El asistente está escribiendo"`.
- [ ] Quick replies: agrupados con `role="group"` y `aria-label="Sugerencias rápidas"`.

### 6.4 Responsive y mobile

- [ ] Área de toque mínima 44×44px (botón Enviar, quick replies).
- [ ] `viewport` con `width=device-width, initial-scale=1` ✅.
- [ ] `100dvh` en lugar de `100vh` para evitar saltos por URL bar.
- [ ] Soporta zoom hasta 200% sin pérdida de funcionalidad.

### 6.5 Motion

- [ ] `prefers-reduced-motion: reduce` desactiva la animación de los 3 puntos (los muestra estáticos).
- [ ] Scroll automático a nuevo mensaje usa `behavior: smooth` solo si no hay `prefers-reduced-motion`.

### 6.6 Form input

- [x] Textarea con `<label>` (visible o `sr-only`).
- [x] Placeholder NUNCA sustituye al label.
- [x] Sin `autocomplete` agresivo en clave de expediente (`autocomplete="off"`).
- [x] No persistir input en localStorage.

---

### 5.9 Chips contextuales (post-respuesta)

Aparecen debajo del **último mensaje del asistente** cuando este sugiere acciones rápidas. Implementan la convención `[CHIPS: …]` documentada en [`AGENT.md §6`](./AGENT.md).

**Comportamiento:**
- Solo se renderizan en el **último** mensaje del asistente; al enviar un nuevo turno, los chips viejos desaparecen.
- Click envía el texto del chip como si el ciudadano lo hubiera tecleado.
- En la **bienvenida** los chips son hardcoded (`WELCOME_CHIPS` en `Chat.tsx`); en turnos posteriores vienen del backend (`data.chips`).

**Especificación visual:**

| Propiedad | Valor |
|---|---|
| Forma | `rounded-full` (pill) |
| Altura mínima | 44px (área de toque accesible) |
| Padding | `px-4 py-2` |
| Fondo | `surface-muted` (#EEF3FB) |
| Borde | 1px `border-line` (#DEE3EA) |
| Texto | `text-sm` · `text-ink-secondary` (#3D4053) |
| Hover | borde y texto pasan a `brand-700` (#DC362E) |
| Focus | anillo `focus-ring` 3px con offset 2px (heredado de globals) |
| Layout | `flex-wrap gap-2` — chips bajan a la línea siguiente si no caben |
| Container | `role="group"` + `aria-label="Sugerencias rápidas"` |

**Cantidad esperada:** 2 a 4 chips. Cada uno ≤ 6 palabras / 60 caracteres (el endpoint filtra los que superan ese límite).

### 5.10 Markdown rendering en burbujas del asistente

Las burbujas del asistente renderizan markdown con `react-markdown` + `remark-breaks`. Las del usuario son texto plano (no se parsea por seguridad y previsibilidad).

**Tags soportados y su mapping a tokens:**

| Markdown | Componente Tailwind |
|---|---|
| `**negrita**` | `<strong class="font-semibold text-ink-primary">` |
| `*itálica*` | `<em class="italic">` |
| `- lista` | `<ul class="my-2 list-disc space-y-1 pl-5">` |
| `1. lista` | `<ol class="my-2 list-decimal space-y-1 pl-5">` |
| `---` | `<hr class="my-3 border-line">` |
| `[texto](url)` y mailto auto | `<a class="text-accent-user underline">` — `target=_blank rel=noopener` solo en http(s) externos |
| `` `código` `` | `<code class="bg-surface-muted px-1.5 py-0.5">` |
| `# / ## / ###` | Render como `<p class="font-semibold">` (no jerarquía visual de h1/h2/h3 — uniformamos) |
| `\n` simple | Se convierte en `<br>` gracias a `remark-breaks` |

**Por qué solo el asistente**: el ciudadano no envía markdown intencional; renderizar su texto como markdown abre vector de injection visual (ej. el ciudadano escribe `**hola**` y lo vería en negrita en su propia burbuja, lo cual confunde).

---

## 7. Tokens propuestos para `tailwind.config.ts`

```ts
theme: {
  extend: {
    colors: {
      brand:    { 50: '#FCEEEE', 700: '#DC362E', 800: '#BF0909' },
      surface:  { page: '#F6F9FC', card: '#FFFFFF', muted: '#EEF3FB' },
      text:     { primary: '#0D1028', secondary: '#3D4053', muted: '#555869' },
      border:   { DEFAULT: '#DEE3EA' },
      accent:   { user: '#0056AC', userHover: '#184397' },
      state:    {
        successFg: '#126B49', successBg: '#E3F3EC',
        warningFg: '#D75600', warningBg: '#FFF3EA',
        infoFg:    '#184397', infoBg:    '#EEF3FB',
        dangerFg:  '#BF0909', dangerBg:  '#FCEEEE',
      },
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    ringColor:  { focus: '#1363D0' },
    ringWidth:  { focus: '3px' },
    borderRadius: { bubble: '1rem' },
  },
},
```

---

## 8. Estados de la conversación — matriz de diseño

| Momento | Lo que ve el usuario | Componentes activos |
|---|---|---|
| **Cold start** | Header + bienvenida con 3 bullets (capacidades) + 3 chips hardcoded debajo | Header, burbuja asistente con markdown, ChipsRow |
| **Esperando primer input** | Igual + cursor en textarea | + foco visible en textarea |
| **Usuario escribió, esperando respuesta** | Burbuja usuario + indicador "escribiendo" | + TypingBubble (3 dots) |
| **Asistente pide expediente** | Burbuja del asistente con ejemplo de formato | — |
| **Asistente pide clave** | Burbuja del asistente con explicación de qué es la clave | — |
| **Resultado de expediente entregado** | Burbuja con plantilla markdown estructurada (Número, Trámite, Titular, Estado, etc.) + ChipsRow con chips contextuales | Bubble + ChipsRow |
| **Información de trámite entregada** | Burbuja con plantilla TUPA (DP-XXX, Requisitos, Plazo, Costo, Canal) + ChipsRow con los otros 2 trámites + "Consultar mi expediente" | Bubble + ChipsRow |
| **Respuesta en quechua** | Misma estructura, todas las palabras del asistente en runasimi; valores del API quedan en español | Igual |
| **Mensaje único en aymara** | Una sola burbuja en aymara con teléfono de contacto, sin chips ni siguiente pregunta | Bubble |
| **Error de API (404/401/502)** | Burbuja del asistente con mensaje humano (no código HTTP) | — |
| **Sin red (fetch falla)** | SystemBubble roja "Sin conexión. Verifica tu internet." con botón "Reintentar" que reenvía último mensaje del usuario | SystemBubble con `tone="danger"` |

---

## 9. Cambios completados (estado de implementación)

Todos los puntos del plan original están en producción:

- [x] **`tailwind.config.ts`** con tokens gob.pe (brand, surface, ink, line, accent, state, focus ring, bubble radius).
- [x] **`layout.tsx`** con Inter cargada vía `next/font/google` y variable `--font-inter`.
- [x] **`globals.css`** con `:focus-visible` global (3px offset 2px), `@media (prefers-reduced-motion: reduce)` y `.tabular` para dígitos.
- [x] **`Chat.tsx`** — header con borde inferior, burbujas usuario en `accent-user`, burbujas asistente con render markdown, avatar condicional, aria-live, role=log, autocomplete=off en textarea, disclaimer en footer.
- [x] **`SystemBubble.tsx`** para errores de red (`danger`) y confirmaciones (`success`/`info`).
- [x] **Markdown rendering** con `react-markdown` + `remark-breaks` (§5.10).
- [x] **Chips contextuales** post-respuesta (§5.9).
- [x] **Soporte de quechua** en el flujo conversacional (texto y plantillas).

Lo único pendiente (no es de diseño sino de integración):

- [ ] Envío real de correo (CU-06 / `enviar_resultado_por_correo` hoy es stub, ver [`API.md §3`](./API.md)).

---

## 10. Fuera de scope (fase 2)

- Modo oscuro completo.
- Streaming de tokens del agente con SSE.
- Animación de entrada de burbujas tipo iMessage.
- Avatar con foto institucional vs. monograma.
- Tema de alto contraste manual (más allá del soporte de SO).
- Soporte total de más lenguas originarias (hoy quechua completo, aymara solo derivación).

---

**Sources:**
- [Sistema de Diseño del Estado Peruano — Colores (gob.pe)](https://guias.servicios.gob.pe/creacion-servicios-digitales/estilos/colores)
- [Sistema de Diseño del Estado Peruano — Logo](https://guias.servicios.gob.pe/creacion-servicios-digitales/estilos/logo)
- [WCAG 2.1 AA — W3C](https://www.w3.org/WAI/WCAG21/quickref/)
