# Plan de Diseño — Asistente DP

**Versión 1.0 · 2026-06-13**
Basado en PRD v2.0 (chat-only) y en la paleta oficial del Sistema de Diseño del Estado Peruano ([gob.pe](https://guias.servicios.gob.pe/creacion-servicios-digitales/estilos/colores)).

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

- **Estructura**: avatar (32px) + grupo `(eyebrow "DESPACHO PRESIDENCIAL" + título "Asistente de expedientes")`.
- **Color**: fondo blanco con borde inferior `border-default` 1px. **No usamos rojo lleno** porque pesa visualmente sobre un chat largo — el rojo aparece solo en el avatar.
- **Comportamiento**: sticky top, no se oculta al scrollear (anchor de identidad).

### 5.2 Burbuja del asistente

- Texto en `text-base` (16px), `text-primary`.
- Soporte de salto de línea (`whitespace-pre-wrap`).
- Si contiene un **estado de expediente**, renderizar con badge inline coloreado según §2.3.
- Si contiene una **dirección o correo**, hacerlo `<a>` con focus ring.

### 5.3 Burbuja del usuario

- Texto blanco sobre `accent-user`. Probado: ratio 7.2:1 (AAA).

### 5.4 Quick reply chips (turn 1)

- Pills horizontales, `surface-muted` por default, `border-default` 1px.
- Hover: borde `brand-700`, texto `brand-700`.
- Focus: anillo `focus-ring`, 3px, offset 2px.
- Altura mínima: 36px en desktop, **44px en móvil** (área de toque accesible).
- Texto sugerido para el turn 1:
  - "Consultar mi expediente"
  - "Requisitos de una Solicitud Simple"
  - "Horarios de mesa de partes"

### 5.5 Indicador "el asistente está escribiendo"

- Tres puntos animados (`animate-bounce` con delays 0s, 0.15s, 0.3s) dentro de una burbuja del asistente vacía.
- Etiqueta accesible: `aria-label="El asistente está escribiendo"` en el contenedor.
- Tiempo máximo visible antes de timeout: 30s.

### 5.6 Input bar

- **Textarea autoexpansible** (max 4 líneas, después scroll interno).
- Placeholder: "Escríbele al asistente…"
- **Botón Enviar**:
  - Estado normal: fondo `accent-user`, texto blanco, `rounded-full`, 44×44px en móvil.
  - Disabled (input vacío o cargando): opacity 50%, cursor not-allowed.
  - Icon-only en móviles (≤640px) — `aria-label="Enviar mensaje"`.
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

- [ ] Textarea con `<label>` (visible o `sr-only`).
- [ ] Placeholder NUNCA sustituye al label.
- [ ] Sin `autocomplete` agresivo en clave de expediente (`autocomplete="off"`).
- [ ] No persistir input en localStorage.

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
| **Cold start** | Header + 1 mensaje de bienvenida + 3 quick replies | Header, burbuja asistente, chips |
| **Esperando primer input** | Igual + cursor en textarea | + foco visible en textarea |
| **Usuario escribió, esperando respuesta** | Burbuja usuario + indicador "escribiendo" | + typing bubble |
| **Asistente pide expediente** | Burbujas en secuencia | — |
| **Asistente pide clave** | Burbujas en secuencia | — |
| **Resultado entregado** | Burbuja con datos + badge de estado coloreado | + opción de envío por correo |
| **Envío por correo OK** | Burbuja sistema verde "✓ Enviado a…" | + nueva ronda de quick replies opcionales |
| **Error de API** | Burbuja del asistente con mensaje humano | — |
| **Sin red** | Burbuja sistema roja "Sin conexión. Reintenta." | botón "Reintentar" inline |

---

## 9. Cambios pendientes en código

1. **`tailwind.config.ts`** — reemplazar tokens actuales (genéricos) por los de §7.
2. **`layout.tsx`** — agregar `next/font/google` con Inter + variable CSS.
3. **`globals.css`** — declarar `--focus-ring`, agregar `@media (prefers-reduced-motion: reduce)` para desactivar animaciones.
4. **`Chat.tsx`** — actualizar:
   - Colores: header con borde inferior en lugar de fondo brand.
   - Burbujas: usar `accent.user` (azul) en lugar de `brand` (rojo).
   - Aria: agregar `role="log"`, `aria-live="polite"` en el contenedor, `aria-label` en burbujas y botón.
   - Avatar del asistente: render condicional en primer mensaje de la secuencia.
   - Badge de estado: helper para colorear según §2.3.
   - Disclaimer footer: `text-xs text-text-muted`.
5. **Estados especiales**: nuevos componentes `<SystemBubble />` para errores de red y confirmaciones de correo.

---

## 10. Fuera de scope (fase 2)

- Modo oscuro completo.
- Streaming de tokens del agente con SSE.
- Animación de entrada de burbujas tipo iMessage.
- Avatar con foto institucional vs. monograma.
- Tema de alto contraste manual (más allá del soporte de SO).
- Internacionalización (quechua, aimara).

---

**Sources:**
- [Sistema de Diseño del Estado Peruano — Colores (gob.pe)](https://guias.servicios.gob.pe/creacion-servicios-digitales/estilos/colores)
- [Sistema de Diseño del Estado Peruano — Logo](https://guias.servicios.gob.pe/creacion-servicios-digitales/estilos/logo)
- [WCAG 2.1 AA — W3C](https://www.w3.org/WAI/WCAG21/quickref/)
