# 🌬️ CASA AIRA - Elegancia, Frescura y Libertad

Plataforma de e-commerce de alta costura para vestidos exclusivos en Chile, construida con Next.js 16, React 19, TypeScript, base de datos SQLite distribuida en Turso DB, CDN Cloudinary para medios y pasarela de pago Mercado Pago con conciliación atómica de inventario.

---

## 🚀 Stack Tecnológico & Servicios Auditados

- **Frontend & Routing**: Next.js 16 (App Router con Turbopack) + React 19 + TypeScript 5.9 (36 rutas compiladas).
- **Dirección de Arte**: Paleta boutique Casa Aira (Alabastro `#FAF8F5`, Obsidiana `#181716`, Calipso Egeo `#1D707F`, Oro Champagne `#BFA15F`).
- **Base de Datos**: Turso DB (`@libsql/client` SQLite distribuido edge con 9 tablas relacionales y migraciones automáticas).
- **Gestión Multimedia**: Cloudinary CDN (`a2w9mxxn`) con pre-compresión WebP en el navegador y subida server-side firmada.
- **Pasarela de Pago**: Mercado Pago SDK Chile (`MLC`) con creación atómica de órdenes, conciliación de variantes $Talla \times Color$ y webhook con verificación zero-trust.
- **Validación Logística Chilena**: Validador oficial de RUT (Algoritmo Módulo 11) y selector de las 16 regiones y comunas para Starken y Chilexpress.
- **Resiliencia de Compra**: Preservación del carrito ante fallos o cancelaciones en pasarela; vaciado seguro únicamente en `/checkout/success`.
- **Módulos Administrativos**: Editor de Colecciones Portada, Compromiso & Asesoría, Experiencia de Empaque, Ajustes Generales & Redes, Pedidos y Cupones.
- **Calidad & Testing**: Vitest (88 tests unitarios pasando al 100% en 21 suites) + TypeScript estricto (0 errores).

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

# 2. Iniciar servidor de desarrollo
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
| `npm test` | Ejecutar la suite completa de 88 pruebas unitarias con Vitest |
| `npm run type-check` | Verificar tipos TypeScript (`tsc --noEmit`) |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Corregir automáticamente problemas de linting |
| `npm run format` | Formatear código con Prettier |

---

## 🏗️ Estructura del Proyecto

```
src/
├── app/                        # Next.js App Router (36 rutas)
│   ├── admin/                  # Panel de control protegido por JWT
│   │   ├── collections/        # Gestión de Colecciones de Portada
│   │   ├── coupons/            # Gestión de Cupones y Cortesías
│   │   ├── manifesto/          # Compromiso & Asesoría de Tallas
│   │   ├── orders/             # Gestión y despacho de pedidos
│   │   ├── products/           # Catálogo, creación y edición de vestidos
│   │   ├── settings/           # Ajustes de Tienda, Contacto y Redes
│   │   ├── subscribers/        # Club Casa Aira (Newsletter)
│   │   └── unboxing/           # Experiencia de Empaque
│   ├── api/                    # Route Handlers REST y Webhooks
│   │   ├── admin/              # Endpoints administrativos protegidos por JWT
│   │   ├── auth/               # Login/Logout seguro con cookie HttpOnly
│   │   ├── checkout/           # Creación atómica de órdenes Mercado Pago
│   │   ├── coupons/            # Validación de cupones con límites
│   │   ├── products/           # CRUD de productos y subida a Cloudinary
│   │   ├── settings/           # Ajustes públicos de contacto y redes
│   │   └── webhook/            # Webhook oficial de Mercado Pago
│   ├── catalogo/               # Catálogo dinámico y ficha de producto [slug/id]
│   ├── checkout/               # Flujo de pago, RUT chileno, cupones y confirmaciones
│   └── politicas/              # Términos, privacidad y cambios/devoluciones
├── components/                 # Componentes React modulares
│   ├── admin/                  # Formularios admin, compresores WebP y previewers
│   ├── checkout/               # Formulario de despacho con RUT y selector regional
│   └── ...                     # CartDrawer, Footer, Header, CasaAiraLogo
├── lib/                        # Lógica de negocio y servicios
│   ├── db/                     # Clientes y tablas Turso DB (products, orders, settings, etc.)
│   ├── auth.ts                 # JWT con Web Crypto API nativo
│   ├── cloudinary.ts           # Cliente firmado para subida a Cloudinary
│   ├── imageUtils.ts           # Compresión client-side a WebP
│   └── rut-validator.ts        # Algoritmo Módulo 11 oficial chileno
├── types/                      # Interfaces TypeScript estructuradas
└── tests/                      # 21 suites de pruebas automatizadas (Vitest)
    └── unit/                   # Tests de pagos, stock, cupones, RUT, ajustes y UI
```

---

## 🔧 Variables de Entorno Activas

```env
# Aplicación
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=CASA AIRA
NEXT_PUBLIC_APP_URL=https://kuyenchile.cl

# Base de Datos Turso (LibSQL Edge)
TURSO_CONNECTION_URL=libsql://kuyen-matiquelmec.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=...

# Almacenamiento Multimedia Cloudinary
CLOUDINARY_CLOUD_NAME=a2w9mxxn
CLOUDINARY_API_KEY=199515812548283
CLOUDINARY_API_SECRET=...

# Pasarela de Pago Mercado Pago (Chile - MLC)
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...
MP_ACCESS_TOKEN=APP_USR-...

# Autenticación Admin
JWT_SECRET=kuyen_admin_super_secret_key_2026
ADMIN_PASSWORD=admin_kuyen_2026
```

---

## 📄 Licencia

Este proyecto es privado y propiedad exclusiva de **Casa Aira Boutique**.
