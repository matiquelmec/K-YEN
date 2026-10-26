---
name: flow-and-persistence-audit
description: Reglas de auditoría transaccional para pagos con Flow.cl (HMAC-SHA256), validación de inventario por variante (Talla x Color), cupones de descuento y persistencia en Turso SQLite + Drizzle ORM.
---

# Flow.cl & Persistence Audit Skill — Casa Aira Boutique

Esta skill define las reglas innegociables para auditar y modificar el flujo de pagos con **Flow.cl**, la deducción de inventario y la persistencia en **Turso DB (`@libsql/client` + Drizzle ORM)**.

## 1. Contratos de Base de Datos (Turso + Drizzle)

- **Esquema Centralizado:** `src/db/schema.ts` y cliente en `src/db/index.ts`.
- **Cero DDL en Tiempo de Ejecución:** Evitar ejecutar `CREATE TABLE` repetitivos en cada request HTTP; mantener banderas de inicialización idempotentes o migraciones previas.
- **Operaciones Atómicas (`turso.batch`):** Al descontar stock de un pedido o sincronizar variantes ($Talla \times Color$), agrupar las sentencias SQL en `turso.batch(statements, 'write')` para garantizar atomicidad ACID y un solo viaje de red.

## 2. Flujo de Pago Flow.cl (`src/lib/flow.ts`)

1. **Firma Criptográfica HMAC-SHA256 (`signFlowParams`):**
   - Ordenar alfabéticamente todas las llaves del payload (excepto `s`).
   - Concatenar `key + value` sin separadores.
   - Firmar con `crypto.createHmac('sha256', FLOW_SECRET_KEY).update(toSign).digest('hex')`.
2. **Validación Server-Side en `/api/checkout`:**
   - Nunca confiar en el precio enviado desde el cliente; consultar siempre `products` en Turso DB.
   - Verificar tanto el `stock` general como el `stock_quantity` de la combinación `size` + `color` en `product_variants`.
   - Verificar que el cupón esté activo (`is_active = 1`), no haya expirado (`expires_at`), no supere `usage_limit` y cumpla `min_cart_amount`.
3. **Conciliación Dual e Idempotente (`/api/webhook/flow` y `/api/flow/return`):**
   - Flow envía el retorno del cliente mediante `HTTP POST` (`application/x-www-form-urlencoded`) a `/api/flow/return`.
   - Tanto el webhook como el endpoint de retorno deben consultar `getFlowPaymentStatus(token)` directamente a Flow, verificar que `status === 2` (Pagada) y que `amount` coincida con `order.total`, ejecutar `dbConfirmOrderPaymentAndDeductStock` (que es idempotente si la orden ya está `'paid'`) y, en el caso de `/api/flow/return`, redirigir con `HTTP 303 See Other` hacia `/checkout/success?order_id=...`.
