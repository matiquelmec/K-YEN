# 🏛️ BLUEPRINT ARQUITECTÓNICO MAESTRO 2026 — CASA AIRA BOUTIQUE

> **Versión del Sistema:** 4.0.0 (Titanium Edition — Flow.cl + Drizzle ORM + Turso Edge)  
> **Última Actualización:** Octubre 2026  
> **Estado:** Producción / Alta Disponibilidad ($0 USD Free-Tier Architecture)  
> **Gobernanza:** Regido por [`AGENTS.md`](file:///c:/Users/Matías%20Riquelme/Desktop/Proyectos%20documentados/tienda-vestidos/AGENTS.md) y el protocolo **Titanium Delivery Flow**.

---

## 1. 🌟 Visión General y Pilares Arquitectónicos

**Casa Aira Boutique (`tienda-vestidos`)** es una plataforma de comercio electrónico de alta costura para vestidos exclusivos en Chile (tallas inclusivas `XS` a `6XL`), diseñada bajo los principios de **velocidad perimetral (Edge-First), estética Couture & Quiet Luxury, costo operativo $0 USD y seguridad transaccional Zero-Trust**.

### Pilares del Sistema:
1. **Pasarela de Pago Nativa Flow.cl (`0 KB` SDK):** Integración directa firmada con HMAC-SHA256 (`src/lib/flow.ts`), conciliación dual idempotente (`/api/webhook/flow` y `/api/flow/return` con redirección `303 See Other`) y validación de stock por variante ($Talla \times Color$).
2. **Persistencia Edge con Turso DB + Drizzle ORM:** Esquema relacional de 13 tablas (`src/db/schema.ts`) con índices optimizados (`idx_products_slug`, `idx_variants_product_id`, `idx_orders_payment_id`) y escrituras atómicas (`turso.batch`).
3. **Dirección de Arte Couture Editorial:** Paleta Alabastro (`#FAF8F5`), Obsidiana (`#181716`), Calipso Egeo (`#1D707F`) y Oro Champagne (`#BFA15F`), tipografía *Playfair Display* + *Inter*, retícula Base 8 y Touch Targets $\ge 44\text{px}$.
4. **Optimización Multimedia Autónoma:** Video Hero con selección condicional de fuente por viewport (`<source media="...">` sin doble descarga), pre-compresión WebP en el navegador (`src/lib/imageUtils.ts`) y extracción automática de colores dominantes en Canvas (`src/lib/color-extractor.ts`).

---

## 2. 🚀 Arquitectura Técnica y Flujo Transaccional

```mermaid
flowchart TD
    Client["👗 Clienta (Móvil / Desktop)"] -->|Next.js 16 App Router| UI["UI Couture (Playfair + Tailwind Base 8)"]
    UI -->|POST /api/checkout| CheckoutAPI["Checkout Route Handler"]
    CheckoutAPI -->|Valida Precio, Stock Variante y Cupón| Turso[("Turso DB (LibSQL + Drizzle Schema)")]
    CheckoutAPI -->|POST /payment/create (HMAC-SHA256)| Flow["🏦 Flow.cl Pasarela (Webpay, MACH, Khipu)"]
    Flow -->|POST /api/webhook/flow| Webhook["Webhook Confirmación Asíncrona"]
    Flow -->|POST /api/flow/return| Return["Return Handler (HTTP 303 Redirect)"]
    Webhook -->|GET /payment/getStatus + Batch Stock| Turso
    Return -->|GET /payment/getStatus + Redirect 303| Success["/checkout/success?order_id=..."]
```

---

## 3. 🗄️ Esquema Relacional Centralizado (`src/db/schema.ts`)

El esquema en Drizzle ORM comprende **13 tablas**:
1. `categories`: Colecciones y capítulos del catálogo (`veraniego`, `gotico`, `primaveral`).
2. `products`: Catálogo de vestidos con precios enteros en CLP, stock global e índices por `slug` y `category_id`.
3. `sizes`: Tallas inclusivas (`XS` a `6XL`, con indicador `is_plus_size`).
4. `colors`: Tonalidades con código hexadecimal (`hex_code`).
5. `product_variants`: Matriz cartesiana $Producto \times Talla \times Color$ con `stock_quantity` y `sku_variant`.
6. `product_images`: Galería ordenada por producto (`is_primary`, `display_order`).
7. `orders`: Pedidos con `order_number`, `status`, `payment_status`, `payment_id` (token/flowOrder), `total`, `shipping_address`, `items` y `coupon_code`.
8. `coupons`: Cupones porcentuales o fijos con `min_cart_amount`, `usage_limit`, `usage_count`, `expires_at` y `affiliate_name`.
9. `subscribers`: Miembros del Club Exclusivo Casa Aira.
10. `store_settings`: Configuración dinámica de contacto, WhatsApp, dirección y redes sociales.
11. `collections`: Tarjetas editoriales de colecciones de portada.
12. `manifesto_settings`: Contenido editable de la sección Compromiso & Asesoría de Calce.
13. `unboxing_settings`: Contenido editable de la sección Experiencia de Empaque Boutique.

---

## 4. 🧪 Puerta de Calidad y Comandos Oficiales

```bash
# Verificación estricta de tipos TypeScript (0 errores)
npm run typecheck

# Ejecución de las 22 suites de pruebas unitarias (91 tests en Vitest)
npm test

# Compilación de producción y generación de Sitemap XML
npm run build
```
