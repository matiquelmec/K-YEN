# 🌙 KÜYEN - Donde la elegancia florece bajo la luna

Plataforma de e-commerce moderna y de alta costura para vestidos exclusivos, construida con Next.js 16, React 19, TypeScript, base de datos SQLite distribuida en Turso y pasarela de pago Mercado Pago.

---

## 🚀 Stack Tecnológico

- **Frontend & Routing**: Next.js 16 (App Router con Turbopack) + React 19 + TypeScript 5.9
- **Base de Datos**: Turso DB (`@libsql/client` SQLite distribuido a nivel edge, ultra-rápido y con 9 tablas relacionales)
- **Auto-Detección de Colores**: Algoritmo Canvas Client-Side y Distancia Euclidiana RGB (100% Gratis, sin APIs externas)
- **Gestión Multimedia**: Cloudinary Media CDN (con pre-compresión WebP en el navegador y nombres semánticos SEO)
- **Pasarela de Pago**: Mercado Pago SDK (preferencias atómicas y webhook con verificación de estado)
- **Marketing & Crecimiento**: Sistema nativo de Cupones de Descuento y Tracking de Afiliadas / Embajadoras
- **Estilos y Estética**: Tailwind CSS + Framer Motion (diseño "Boutique Dark", transiciones suaves y microinteracciones)
- **Calidad & Testing**: Vitest (34 tests unitarios) + ESLint + Prettier + TypeScript estricto

---

## ⚡ Inicio Rápido

### Requisitos
- Node.js >= 20.0.0
- npm >= 10.0.0

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio e instalar dependencias
git clone https://github.com/matiquelmec/K-YEN.git
cd K-YEN
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo
npm run dev
```

🌐 **URL Local**: `http://localhost:3000`  
🔐 **Panel de Administración**: `http://localhost:3000/admin`

---

## 📋 Scripts Disponibles

| Script | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo local con Turbopack |
| `npm run build` | Compilación optimizada para producción + generación de sitemaps XML |
| `npm run start` | Servidor de producción |
| `npm test` | Ejecutar la suite completa de 34 pruebas unitarias con Vitest |
| `npm run type-check` | Verificar tipos TypeScript (`tsc --noEmit`) |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Corregir automáticamente problemas de linting |
| `npm run format` | Formatear código con Prettier |
| `npm run test:build` | Validación completa antes de deploy (`types + lint + test + build`) |

---

## 🏗️ Estructura del Proyecto

```
src/
├── app/                        # Next.js App Router (29 rutas)
│   ├── admin/                  # Panel de control protegido por JWT
│   │   ├── coupons/            # Gestión de Cupones y Afiliadas
│   │   ├── orders/             # Gestión y despacho de pedidos
│   │   ├── products/           # Catálogo, creación y edición de vestidos
│   │   └── subscribers/        # Gestión de lista de boletín
│   ├── api/                    # Route Handlers REST y Webhooks
│   │   ├── admin/              # Endpoints administrativos protegidos
│   │   ├── auth/               # Login/Logout seguro con cookie HttpOnly
│   │   ├── checkout/           # Creación atómica de órdenes Mercado Pago
│   │   ├── coupons/            # Validación de cupones con rate limiting
│   │   ├── products/           # CRUD de productos y subida a Cloudinary
│   │   ├── revalidate/         # Revalidación On-Demand ISR de catálogo
│   │   └── webhook/            # Webhook oficial de Mercado Pago
│   ├── catalogo/               # Catálogo dinámico y ficha de producto [slug/id]
│   ├── checkout/               # Flujo de pago, cupones y confirmaciones (success dinámico)
│   └── politicas/              # Términos, condiciones y privacidad
├── components/                 # Componentes React modulares
│   ├── admin/                  # MultiImageUpload, ProductForm, CouponForm, etc.
│   ├── checkout/               # Formulario de despacho, selector de pago y cupones
│   └── ...                     # ProductCard, Cart (Bolso), Footer, Header
├── lib/                        # Lógica de negocio y servicios
│   ├── db/                     # Clientes y consultas Turso DB (products, coupons, orders)
│   ├── auth.ts                 # JWT con Web Crypto API nativo
│   ├── colorExtractor.ts       # Extractor de colores dominantes por Canvas
│   ├── cloudinary.ts           # Cliente firmado para subida a Cloudinary
│   ├── imageUtils.ts           # Compresión client-side a WebP
│   └── product-utils.ts        # Paleta de colores KÜYEN y utilidades
├── types/                      # Interfaces TypeScript estructuradas
└── tests/                      # Suites de pruebas automatizadas (Vitest)
    └── unit/                   # Tests de cupones, variantes, colores y UI
```

---

## 🔧 Variables de Entorno (`.env.local`)

```env
# Aplicación
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KÜYEN

# Autenticación Admin
JWT_SECRET=tu_clave_secreta_jwt_de_al_menos_32_caracteres
ADMIN_EMAIL=admin@kuyenchile.cl
ADMIN_PASSWORD=tu_password_seguro

# Base de Datos Turso (LibSQL)
TURSO_CONNECTION_URL=libsql://kuyen-matiquelmec.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=tu_token_turso

# Almacenamiento Cloudinary
CLOUDINARY_CLOUD_NAME=a2w9mxxn
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Pasarela de Pago Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
```

---

## 📚 Documentación Adicional

- [🏛️ Blueprint Arquitectónico Maestro](docs/BLUEPRINT.md)
- [🛠️ Guía de Desarrollo y Flujos Técnicos](docs/DESARROLLO.md)
- [🚀 Guía de Entrega y Administración](docs/ENTREGA.md)

---

## 📄 Licencia

Este proyecto es privado y propiedad exclusiva de **KÜYEN Chile**. Desarrollado con 🤍 y excelencia técnica.
