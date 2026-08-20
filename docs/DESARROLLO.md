# Desarrollo del Proyecto Tienda KÜYEN 👗

## Resumen del Proyecto
Plataforma de E-commerce moderna y de alto rendimiento para la marca de vestidos KÜYEN, con panel de administración, catálogo dinámico, procesamiento de pagos con Mercado Pago y base de datos relacional distribuida en Turso (LibSQL).

## Stack Tecnológico
- **Frontend / Framework**: Next.js 16 con App Router, React 19 y TypeScript 5.9.
- **Base de Datos**: Turso (SQLite distribuido) vía `@libsql/client` con soporte offline/local (`file:local.db`).
- **Imágenes & CDN**: Cloudinary con compresión WebP, sanitización NFD y transformaciones automáticas (`f_auto,q_auto`).
- **Pagos**: Mercado Pago SDK con checkout atómico y validación de webhooks.
- **Seguridad**: JWT HMAC-SHA256 en Web Crypto API, Rate Limiting por IP, Content Security Policy (CSP) y Validador de Entorno estricto.
- **Testing**: Vitest con entorno JSDOM y `@testing-library/react`.

## Variables de Entorno (.env.local)
```env
# Aplicación
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Autenticación Admin
JWT_SECRET=tu_secreto_jwt_seguro
ADMIN_EMAIL=contacto@kuyenchile.cl
ADMIN_PASSWORD=tu_password_admin_seguro

# Base de datos Turso
TURSO_CONNECTION_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...

# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Arquitectura de Checkout Atómico
1. **Petición del cliente**: Formulario de envío y carrito se envían a `POST /api/checkout`.
2. **Validación del servidor**: Se valida stock y precios reales contra la base de datos Turso.
3. **Persistencia previa**: Se crea la orden con estado `pending` y se asocia al `external_reference`.
4. **Preferencia de Pago**: Se genera la preferencia en Mercado Pago con los datos del comprador.
5. **Webhook Seguro**: Al completarse la transacción, el webhook valida el pago con la API de Mercado Pago, actualiza el estado a `paid` y descuenta el stock de los productos comprados de forma atómica.
