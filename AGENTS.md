# 🏛️ REGLAS DE DESARROLLO Y ARQUITECTURA: CASA AIRA BOUTIQUE (2026)

Este archivo define las directrices, contratos arquitectónicos y estándares de ingeniería para todos los agentes de Inteligencia Artificial y desarrolladores que operen en el repositorio de **Casa Aira Boutique (`tienda-vestidos`)**, bajo el protocolo **Titanium Delivery Flow — Nivel 5 (Couture Flagship 2026)**.

---

## 1. STACK TECNOLÓGICO OFICIAL (SSoT)

* **Framework:** Next.js 16 (App Router, Server Components, Route Handlers y Turbopack).
* **Lenguaje:** TypeScript 5.9+ en modo estricto (`npm run typecheck` / `npm run type-check`).
* **Base de Datos:** **Turso DB (LibSQL / SQLite Edge Database)** con cliente `@libsql/client`.
* **ORM & Esquema Centralizado:** **Drizzle ORM** (`src/db/schema.ts`, `src/db/index.ts`).
* **Validación de Contratos:** **Zod v4** (`zod`) mediante `safeParse` en mutaciones, checkout, cupones y configuraciones.
* **Pasarela de Pagos:** **Flow.cl Nativa (`src/lib/flow.ts`)** con firma criptográfica **HMAC-SHA256** (`crypto` nativo, 0 KB de dependencias externas), conciliación dual idempotente (`/api/webhook/flow` + `/api/flow/return` con redirección `303 See Other`) y deducción atómica de inventario por variante ($Talla \times Color$).
* **Almacenamiento Multimedia & CDN:** **Cloudinary CDN (`src/lib/cloudinary.ts`)** con transformación automática `f_auto,q_auto:good` vía `optimizeCloudinaryUrl()` (`src/lib/product-utils.ts`), pre-compresión WebP en cliente (`src/lib/imageUtils.ts`) y auto-detección perceptual de colores en Canvas 2D (`src/lib/color-extractor.ts`).
* **Dirección de Arte & Estilos:** Tailwind CSS con estética *Couture Editorial & Quiet Luxury* en espacio perceptual OKLCH/Hex (Alabastro `#FAF8F5`, Obsidiana `#181716`, Calipso Egeo `#1D707F`, Oro Champagne `#BFA15F`, Rosa de Alba), tipografía *Playfair Display* + *Inter* y retícula Base 8.
* **Identidad Canónica:** Componente oficial `<CasaAiraLogo />` (`src/components/ui/CasaAiraLogo.tsx`).

---

## 2. PROTOCOLO TITANIUM DELIVERY FLOW — NIVEL 5 (6 FASES)

Toda tarea de alto impacto o refinamiento visual debe ejecutarse siguiendo rigurosamente estas 6 fases:

### FASE 0: PRE-FLIGHT, CONTEXTO & ACTIVACIÓN DE SKILLS
- Verifica que el working tree de Git esté limpio y en la rama correspondiente (`git status`).
- Identifica y lee los `SKILL.md` pertinentes en `.agents/skills/` (o skills globales) antes de escribir código:
  * Si impacta UI/UX, redes sociales, catálogo o conversión ➔ Activa `ui-ux-pro-max`.
  * Si impacta Base de Datos, Stock, Variantes o Pagos Flow.cl ➔ Activa `flow-and-persistence-audit` y `turso-drizzle-engine`.
- Revisa las especificaciones técnicas vigentes en `docs/architecture/BLUEPRINT_2026.md` (y `docs/BLUEPRINT.md`).

### FASE 1: ARQUITECTURA UNIDIRECCIONAL, VALIDACIÓN ZOD & SEGURIDAD BLINDADA
- **Flujo Unidireccional Estricto:** `src/app` ➔ `src/components` / `src/hooks` / `src/services` ➔ `src/db` / `src/lib` ➔ `src/types`.
- **Validación 100% con Zod:** Toda entrada de cliente en rutas de mutación, checkout (`/api/checkout`), cupones (`/api/coupons/validate`) y paneles administrativos debe validarse antes de interactuar con Turso DB.
- **Guardrail de Autenticación Admin:** Todo endpoint o acción administrativa (`/api/admin/*`, `POST/PUT/DELETE /api/products`, `GET/PUT /api/orders`) debe verificar obligatoriamente la cookie `HttpOnly` `kuyen_admin_session` firmada con Web Crypto JWT (`verifyJWT` en `src/lib/auth.ts`).
- **Integridad Financiera y Anti-Fraude en Flow.cl:**
  * Prohibido confiar en precios o descuentos enviados desde el navegador; el servidor recalcula siempre precios desde `products`, verifica stock global y stock por variante (`product_variants` para `Talla × Color`), y valida vigencia (`expires_at`) y límite de usos (`usage_limit`) del cupón.
  * Toda comunicación con Flow.cl (`/payment/create` y `/payment/getStatus`) debe firmarse alfabéticamente con HMAC-SHA256 (`signFlowParams`).
  * La deducción de stock y el incremento de uso de cupones se ejecutan en un único `turso.batch(..., 'write')` atómico e idempotente (`if (currentStatus === 'paid') return true`).
- **Política Zero-Binary Persistence en Turso SQLite:** Nunca almacenar buffers o imágenes Base64 en tablas de Turso DB; almacenar únicamente URLs optimizadas de Cloudinary CDN o rutas estáticas de `/brand/`.

### FASE 2: CRAFTSMANSHIP VISUAL, CONVERSIÓN LUXURY & RENDIMIENTO (NIVEL 5 FLAGSHIP)
- **Retícula Base 8 & Touch Targets:** Espaciados múltiplos de 8 (`8/16/24/32/48px`) y áreas táctiles $\ge 44\text{px}$ ($48\text{px}$ en botones móviles de talla, color, filtro y compra).
- **Mobile-First & Sticky Couture Bar:** En fichas de producto (`/catalogo/[id]`), mantener la barra inferior fija móvil (*Sticky Couture Bar*) con precio, talla activa y CTA directo en zona del pulgar, además de asesoría directa por WhatsApp Concierge (`+56 9 8535 0038`).
- **Contraste WCAG 2.2 AA:** Relación de contraste $\ge 4.5:1$ en toda la tipografía editorial sobre fondos Alabastro (`#FAF8F5`) y Obsidiana (`#181716`).
- **Estados Completos:** Skeletons elegantes (`animate-pulse` en tonos piedra), estados vacíos expresivos con llamada a la acción y feedback de error claro.
- **Optimización CDN Automática (`AVIF/WebP`) & Video Responsivo:**
  * Toda imagen de producto servida desde Cloudinary debe pasar por `optimizeCloudinaryUrl(url, maxWidth)` (`f_auto,q_auto:good,w_...,c_limit`).
  * Videos Hero con `<source media="(min-width: 768px)">` y `preload="metadata"` para evitar doble descarga móvil/escritorio.
- **SEO Rico de E-Commerce (`Schema.org/Product`):** Las fichas de vestidos deben inyectar datos estructurados JSON-LD (`@type: Product` + `Offer` en `CLP` + disponibilidad en tiempo real) para Google Shopping Rich Snippets.
- **Observabilidad Edge (`/api/health`):** Mantener el endpoint de diagnóstico `/api/health` operativo midiendo latencia de Turso DB y estado de servicios críticos.

### FASE 3: TRIPLE PUERTA DE CALIDAD (LOGICAL + SENSORIAL BROWSER GATE)
- **Puerta Lógica:** Añadir o actualizar pruebas unitarias en `tests/unit/*.test.ts`.
- **Comandos Obligatorios (Cero Tolerancia a Fallos):**
  ```bash
  npm run typecheck   # tsc --noEmit (0 errores permitidos)
  npm test            # vitest run (100% de las suites pasando)
  ```
- **Puerta Sensorial (Cuando hay cambios de UI/UX):**
  * Inspeccionar en viewport móvil (`390px`) y escritorio (`1440px`) mediante navegador / Chrome DevTools MCP.
  * Certificar: cero desbordamiento horizontal (`overflow-x: hidden`), jerarquía tipográfica *Playfair Display* impecable y micro-interacciones fluidas.

### FASE 4: GOBERNANZA DOC-AS-CODE EN CASCADA
- Actualizar atómicamente en cada entrega arquitectónica:
  * `README.md` (stack, rutas, scripts y variables de entorno).
  * `docs/architecture/BLUEPRINT_2026.md` (y `docs/BLUEPRINT.md`).
  * `AGENTS.md` (si se introducen nuevas reglas de negocio o contratos técnicos).

### FASE 5: CICLO GIT & ENTREGA EJECUTIVA
- `git add` selectivo de los archivos impactados (nunca subir `.env.local`, `.env.production` ni credenciales).
- Commit semántico bajo *Conventional Commits* (`feat(...)`, `fix(...)`, `refactor(...)`, `style(...)`, `test(...)`, `docs(...)`).
- `git push origin <rama>`.
- Reporte ejecutivo con: tabla de archivos impactados, resultado de pruebas (`typecheck` + `test`), validación sensorial y hash del commit.
