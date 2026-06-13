# Deployment — Asistente DP

**Versión 1.0 · 2026-06-13**
Cómo desplegar, configurar variables de entorno y operar la app en Vercel + local.

---

## 1. Vercel — configuración inicial

### 1.1 Importar el repo

1. Vercel → **New Project** → conectar la cuenta de GitHub.
2. Importar `Gbo2412/TranformaGOBHckthon`.

### 1.2 Configurar el proyecto (crítico)

En **Settings → General**:

| Campo | Valor |
|---|---|
| **Root Directory** | `proyecto/frontend` ← obligatorio, el repo tiene varias carpetas |
| **Framework Preset** | **Next.js** ← si dice "Other" el build falla con error "no public directory" |
| **Build Command** | `next build` (default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |
| **Node Version** | 20.x |

### 1.3 Variables de entorno

En **Settings → Environment Variables** (`Production` + `Preview`):

| Variable | Requerida | Default si falta | Notas |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Sí | — | Sin esto el agente no responde. Obtener de https://console.anthropic.com. |
| `DP_API_BASE_URL` | ❌ No | `https://www.presidencia.gob.pe/api/consulta-expedientes/index.php` | Solo cambiar si el DP migra el endpoint. |
| `RESEND_API_KEY` | 🟡 Pendiente | — | Necesaria cuando se integre el envío real de correo. |
| `EMAIL_FROM` | 🟡 Pendiente | — | Remitente verificado en Resend (dominio gob.pe). |
| `RATE_LIMIT_PER_MIN` | ❌ No (futuro) | — | Reservada para cuando se implemente rate limiting. |

> El archivo `.env.example` en `frontend/` lista todas con valores de ejemplo.

### 1.4 Deployment Protection

Por default en plan Hobby los deploys son públicos. Si la URL pide login:

**Settings → Deployment Protection** → "Vercel Authentication" → **Disabled**.

### 1.5 Deploy

- Cada push a `main` redesploya automáticamente.
- Cada PR genera un **preview deployment** con URL única.

---

## 2. Iframe embedding

El proyecto soporta embeber el chat en otras páginas (gob.pe u otros sitios) via `next.config.mjs`:

```js
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Frame-Options", value: "ALLOWALL" },
      { key: "Content-Security-Policy", value: "frame-ancestors *" },
    ],
  }];
}
```

**Uso en un sitio externo:**
```html
<iframe
  src="https://tranforma-gob-hckthon.vercel.app"
  style="width: 100%; height: 600px; border: 0;"
  title="Asistente DP"
></iframe>
```

⚠️ **Para producción real**: `frame-ancestors *` es demasiado permisivo. Cambiar a:
```js
{ key: "Content-Security-Policy", value: "frame-ancestors 'self' https://*.gob.pe" }
```

---

## 3. Desarrollo local

### 3.1 Setup

```bash
cd proyecto/frontend
cp .env.example .env.local
# editar .env.local con tu ANTHROPIC_API_KEY
npm install
npm run dev
```

Abre http://localhost:3000.

### 3.2 Probar desde el celular (mobile-first QA)

Para probar el responsive en un cel real conectado a la misma WiFi:

```bash
npm run dev -- -H 0.0.0.0
# luego, en tu Mac:
ipconfig getifaddr en0
# usa esa IP en el cel: http://<IP>:3000
```

Si el cel no carga:
- Verifica que el firewall de macOS permita conexiones a Node (System Settings → Network → Firewall).
- Algunas WiFi públicas/empresas tienen "client isolation" — usa una red doméstica.

### 3.3 Build de producción local

```bash
npm run build
npm start
```

Sirve la build optimizada en localhost:3000 — útil para verificar antes de pushear.

---

## 4. Workflow de releases

| Acción | Resultado |
|---|---|
| Push a una branch feature | Vercel preview deployment (URL `*.vercel.app` única). |
| PR contra `main` | Comment automático del bot de Vercel con preview link. |
| Merge a `main` | Production deployment. |

### Convención del repo
- Una branch por feature: `feat/<nombre>` o `docs/<nombre>` o `fix/<nombre>`.
- Mensajes de commit estilo Conventional Commits.
- Mergea por PR (sin push directo a `main`).

---

## 5. Operación

### Observabilidad

- **Logs**: Vercel → Deployments → click deployment → **Runtime Logs**. Muestra `console.log`/`console.error` de los Route Handlers.
- **Analytics**: Vercel Analytics (incluido) — page views, geo, web vitals.
- **No hay aún**: dashboard de turnos por conversación, latencia del agente, costo de tokens.

### Cómo verificar la app está sana

1. Visita la URL pública → el chat carga con bienvenida y 3 chips.
2. Haz clic en "Consultar el estado de un expediente".
3. Envía: `2026-0010582 / 4176`.
4. El agente debe devolver el resultado con la plantilla estructurada y chips.

### Costos esperados

- **Vercel Hobby**: gratis hasta 100GB bandwidth y 100k function invocations/mes.
- **Anthropic Claude Haiku 4.5**:
  - Input: $1 / 1M tokens
  - Output: $5 / 1M tokens
  - System prompt ≈ 3,500 tokens cada llamada (no se cachea por ahora).
  - Estimado: ~$0.005 por conversación promedio (3-4 turnos).
- **Resend** (cuando se integre): 3,000 emails/mes gratis.

---

## 6. Próximos pasos para v1.0 real (post-hackatón)

1. **Integrar Resend** para envío real de correo (ver [`API.md §3`](./API.md)).
2. **Restringir `frame-ancestors`** a `*.gob.pe`.
3. **Rate limiting** con Upstash Redis o Vercel KV.
4. **Prompt caching de Anthropic** (50% descuento en tokens repetidos).
5. **Dominio custom** (ej. `asistente.presidencia.gob.pe`).
6. **Observabilidad custom**: enviar eventos a Vercel Analytics o un endpoint propio.
7. **Tests automatizados**: smoke tests del endpoint `/api/chat` con respuestas mockeadas.
8. **Auditoría de seguridad**: revisar prompt injection, PII en logs.
