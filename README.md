# 🌬️ CASA AIRA BOUTIQUE — Elegancia, Frescura y Libertad

Plataforma de e-commerce de alta costura para vestidos exclusivos en Chile (tallas inclusivas `XS` a `6XL`), construida con **Next.js 16**, **React 19**, **TypeScript 5.9**, **Drizzle ORM + Turso DB (LibSQL Edge)**, **Cloudinary CDN** y pasarela de pago chilena **Flow.cl** con firma criptográfica nativa HMAC-SHA256 y conciliación atómica de inventario.

> 🏛️ **Gobernanza de Ingeniería:** Este repositorio opera bajo el estándar **[AGENTS.md](./AGENTS.md)** y **[BLUEPRINT_2026.md](./docs/architecture/BLUEPRINT_2026.md)** (*Titanium Delivery Flow*).

---

## 🚀 Stack Tecnológico & Servicios Auditados

- **Frontend & Routing**: Next.js 16 (App Router + Turbopack) + React 19 + TypeScript estricto.
- **Dirección de Arte (*Quiet Luxury*)**: Paleta boutique Casa Aira (Alabastro `#FAF8F5`, Obsidiana `#181716`, Calipso Egeo `#1D707F`, Oro Champagne `#BFA15F`).
- **Base de Datos & ORM**: Turso DB (`@libsql/client`) + **Drizzle ORM** ([`src/db/schema.ts`](./src/db/schema.ts) con 13 tablas relacionales e índices de alto rendimiento) + **Zod v4**.
- **Gestión Multimedia**: Cloudinary CDN con pre-compresión WebP en cliente y carga condicional de video Hero (`<source media="...">`).
- **Pasarela de Pago Chilena**: **Flow.cl Nativa** ([`src/lib/flow.ts`](./src/lib/flow.ts) — Webpay Plus, MACH, Khipu, Redpay, Onepay) firmada con HMAC-SHA256, retorno `POST -> 303` (`/api/flow/return`), webhook zero-trust (`/api/webhook/flow`) y deducción atómica de variantes ($Talla \times Color$).
- **Validación Logística Chilena**: Validador oficial de RUT (Algoritmo Módulo 11) y selector de las 16 regiones y comunas para Starken y Chilexpress.
- **Calidad & Testing**: Vitest (**91 tests unitarios pasando al 100% en 22 suites**) + TypeScript estricto (`0 errores`).

---

## 📋 Scripts Oficiales (`Titanium Delivery Flow`)

| Script | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo local con Turbopack |
| `npm run typecheck` | Verificación estricta de tipos TypeScript (`tsc --noEmit` — 0 errores) |
| `npm test` | Ejecución completa de las 22 suites de pruebas unitarias con Vitest |
| `npm run build` | Compilación optimizada para producción + generación de sitemaps XML |
| `npm run lint` | Verificación de estilo con ESLint |

---

## 🔧 Variables de Entorno Requeridas (`.env.local` / Vercel)

```env
# Aplicación
NODE_ENV=production
NEXT_PUBLIC_APP_NAME="CASA AIRA"
NEXT_PUBLIC_APP_URL="https://kuyenchile.cl"

# Base de Datos Turso (LibSQL Edge)
TURSO_CONNECTION_URL="libsql://..."
TURSO_AUTH_TOKEN="..."

# Almacenamiento Multimedia Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Pasarela de Pago Flow.cl (Chile - CLP)
FLOW_API_KEY="tu_api_key_de_flow"
FLOW_SECRET_KEY="tu_secret_key_de_flow"
FLOW_API_URL="https://www.flow.cl/api" # Usar https://sandbox.flow.cl/api en desarrollo

# Autenticación Admin
JWT_SECRET="tu_secreto_jwt_seguro"
ADMIN_PASSWORD="tu_password_admin_seguro"
```

---

## 📄 Licencia

Este proyecto es privado y propiedad exclusiva de **Casa Aira Boutique**.
