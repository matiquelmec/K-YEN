# 👗 Guía Técnica de Desarrollo - Tienda KÜYEN

## 1. Resumen de la Plataforma
KÜYEN es una plataforma de e-commerce de alto rendimiento construida con **Next.js 16 (Turbopack)**, **React 19**, **TypeScript 5.9** y base de datos relacional distribuida en **Turso DB**. Incluye panel de control administrativo, catálogo interactivo con filtrado dinámico, gestión de cupones/afiliadas, auto-detección de colores por Canvas y pagos seguros con Mercado Pago.

---

## 2. Flujo de Variantes y Productos (Turso DB)
Las tallas y colores de cada vestido se almacenan en un modelo relacional estricto:
1. `products`: Datos generales de la prenda (precio, descripción, categoría, estado).
2. `sizes`: Tallas normalizadas (`XS` a `6XL`).
3. `colors`: Paleta oficial con nombres y códigos HEX.
4. `product_variants`: Matriz combinada ($Talla \times Color$) con stock por variante.
5. `product_images`: Galería de imágenes WebP con orden y portada.

La sincronización se realiza atómicamente a través de `syncProductVariants(...)` en `src/lib/db/products.ts`.

---

## 3. Auto-Detección Inteligente de Colores
- Ubicación: `src/lib/colorExtractor.ts`
- Implementación: 100% Client-Side mediante HTML5 Canvas (sin costos de APIs externas).
- Lógica:
  1. Reducción de la imagen a un canvas de $100 \times 100$ px.
  2. Muestreo de píxeles ignorando fondos blancos o transparentes.
  3. Cálculo de color mediante Distancia Euclidiana $\Delta E$ contra la paleta KÜYEN (`KUYEN_COLOR_MAP`).
  4. Activación automática de botones de color en `ProductForm.tsx`.

---

## 4. Cupones y Sistema de Afiliadas / Embajadoras
- Tabla: `coupons` en Turso DB.
- Tipos de Descuento: Porcentual (`%`) o Monto Fijo (`$ CLP`).
- Validaciones en Servidor:
  - `POST /api/coupons/validate`: Verifica activación, vigencia, monto mínimo y límite de usos.
  - `POST /api/checkout`: Re-calcula el descuento en el servidor de forma infalsificable.
  - `POST /api/webhook/mercadopago`: Al confirmarse el pago, incrementa `usage_count` y asocia la orden a la embajadora.

---

## 5. Testing Automatizado (Vitest)
Se cuenta con 34 pruebas unitarias estructuradas en `tests/unit/`:
- `tests/unit/coupons.test.ts`: Validación de reglas de cupones y límites de uso.
- `tests/unit/products-variants.test.ts`: Generación de SKUs y mapeo relacional.
- `tests/unit/color-extractor.test.ts`: Algoritmo Canvas y matching perceptual.
- `tests/unit/multi-image.test.ts`: Validaciones de subida múltiple.
- `tests/unit/slug-resolution.test.ts`: Validación de slugs semánticos y fallback a UUID.
- `tests/unit/payment-stock-deduction.test.ts`: Deducción atómica e idempotencia de inventario.
- `tests/unit/order-whatsapp-generator.test.ts`: Generador dinámico de comprobantes WhatsApp.

Para ejecutar las pruebas:
```bash
npm test
```
