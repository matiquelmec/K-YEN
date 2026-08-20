# Guía de Entrega y Administración - Tienda KÜYEN 🚀

Esta guía contiene la información necesaria para que el cliente final y los administradores gestionen la tienda de forma profesional y segura.

## 1. Acceso al Panel de Administración
*   **URL:** `https://tudominio.cl/admin/login`
*   **Credenciales:** Configuradas en las variables de entorno del servidor (`ADMIN_EMAIL` y `ADMIN_PASSWORD`).
*   **Seguridad:** El sistema cuenta con limitador de tasa (Rate Limiting) que bloquea intentos repetidos de fuerza bruta.

### Tareas Administrativas
*   **Gestión de Catálogo e Inventario:** Desde `/admin/products` se pueden crear nuevos vestidos, cargar imágenes con compresión automática y actualizar precios y stock.
*   **Subida Optimizada de Imágenes:** Las imágenes se comprimen en el navegador antes de enviarse y se alojan en Cloudinary bajo el formato WebP/AVIF para máxima velocidad de carga.
*   **Control de Pedidos:** En `/admin/orders` se visualizan los pedidos con su estado (`pending`, `paid`, `shipped`, `delivered`, `cancelled`).

## 2. Pagos y Finanzas (Mercado Pago)
*   **Webhooks:** El sistema está conectado con Mercado Pago para recibir notificaciones automáticas. Cuando el cliente paga con éxito, la orden cambia automáticamente a `paid` y el stock se descuenta en Turso DB.

## 3. Base de Datos Turso (LibSQL)
*   La plataforma opera sobre Turso con replicación y latencia ultra baja. No requiere mantenimiento manual de servidores PostgreSQL.
