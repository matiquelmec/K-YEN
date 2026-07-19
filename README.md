# 🌙 KÜYEN - Donde la elegancia florece bajo la luna

Plataforma de e-commerce moderna y de alta gama para vestidos exclusivos, construida con Next.js 16, React 19, TypeScript y las mejores prácticas de desarrollo.

## 🚀 Stack Tecnológico

- **Frontend & Routing**: Next.js 16 (App Router) + React 19 + TypeScript
- **Base de Datos**: Turso (libsql/SQLite a nivel edge, ultra-rápido y descentralizado)
- **Almacenamiento de Imágenes**: Cloudinary (con nombres de archivo optimizados para SEO y firma de seguridad activa)
- **Pasarela de Pago**: Mercado Pago (integración nativa y flujos de retorno personalizados)
- **Estilos y Estética**: Tailwind CSS + Framer Motion (interacciones inmersivas y animaciones "Boutique Dark")
- **Control de Calidad**: ESLint + Prettier + Husky (git hooks para commits limpios)

## ⚡ Inicio rápido

### Requisitos
- Node.js >= 20.0.0
- npm >= 10.0.0

### Instalación

```bash
# Clonar e instalar
cd tienda-vestidos
npm install

# Configurar entorno de desarrollo
npm run setup

# Iniciar servidor de desarrollo
npm run dev
```

**🌐 URL local**: http://localhost:3000

## 📋 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo local |
| `npm run build` | Build optimizado para producción |
| `npm run start` | Servidor de producción |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Arreglar automáticamente problemas de lint |
| `npm run format` | Formatear código con Prettier |
| `npm run setup` | Configuración automática del entorno |
| `npm run test:build` | Test completo (types + lint + build) |
| `npm run clean` | Limpiar caché y compilaciones anteriores |

## 🏗️ Estructura del proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal con ErrorBoundary
│   ├── page.tsx           # Página de inicio
│   ├── catalogo/          # Catálogo e interactividad de productos
│   ├── checkout/          # Checkout oscuro inmersivo y confirmaciones de pago
│   ├── politicas/         # Información legal y políticas de la tienda
│   └── globals.css        # Estilos globales y tokens
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes básicos de UI (Logo, etc.)
│   ├── checkout/         # Formulario de dirección y pago
│   ├── Cart.tsx          # Bolso lateral interactivo (Dark Theme)
│   └── ...              # Otros componentes del negocio
├── contexts/              # Contextos de React (Bolsa de compras, etc.)
├── hooks/                # Custom hooks (Formularios, localStorage)
├── lib/                  # Utilidades y servicios
│   ├── db/               # Cliente y servicios de la base de datos Turso
│   ├── auth.ts           # Autenticación segura mediante Web Crypto JWT
│   ├── cloudinary.ts     # Integración con la API de Cloudinary
│   └── config.ts         # Configuración centralizada de la aplicación
└── types/                # Definiciones de tipos TypeScript estructurados
```

## 🔧 Configuración y Entorno

### Variables de entorno

Copiar el archivo `.env.example` a `.env.local` para el entorno local y configurar las siguientes variables críticas:

```env
# Configuración General de Next.js
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KÜYEN

# JWT para Autenticación del Administrador
JWT_SECRET=kuyen_admin_default_secret_key_change_me

# Base de Datos Turso (LibSQL)
TURSO_CONNECTION_URL=your-turso-db-url
TURSO_AUTH_TOKEN=your-turso-auth-token

# Almacenamiento Cloudinary
CLOUDINARY_CLOUD_NAME=x9zkuwyc
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=your-mercadopago-access-token
```

## 📦 Despliegue

### Build local completo de validación
```bash
npm run test:build
```

## 📄 Licencia

Este proyecto es privado y propiedad exclusiva de KÜYEN.

## 💫 Autor

Desarrollado con 🤍 para KÜYEN Chile.