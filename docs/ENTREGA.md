# 🚀 Guía de Entrega y Administración - Tienda KÜYEN

Esta guía contiene la información necesaria para que el equipo de KÜYEN gestione la plataforma de forma autónoma, eficiente y profesional.

---

## 1. Acceso al Panel de Control Administrativo
- **URL de Acceso:** `https://tudominio.cl/admin/login` (o `http://localhost:3000/admin/login` en desarrollo)
- **Credenciales:** Configuradas en las variables de entorno (`ADMIN_EMAIL` y `ADMIN_PASSWORD`).
- **Seguridad:** Protección contra ataques de fuerza bruta (Rate Limiting) y sesiones seguras en cookies `HttpOnly`.

---

## 2. Módulos Administrativos Disponibles

### 👗 2.1. Gestión de Vestidos e Inventario (`/admin/products`)
- **Creación de Vestidos (`/admin/products/new`):**
  - **Galería Visual Múltiple:** Puedes arrastrar hasta 8 fotos por vestido. El sistema las comprime automáticamente a formato WebP de alta definición antes de subirlas.
  - **✨ Auto-Detección de Colores:** Apenas subes una foto, el sistema detecta los tonos dominantes de la tela y selecciona los colores por ti. También puedes usar el botón *"Auto-detectar Colores"*.
  - **Selector de Tallas:** Botones de selección rápida (*Estándar XS-XL*, *Plus Size 2XL-6XL* o *Todas las tallas*).
  - **KPIs en Vivo:** Visualiza en la parte superior el valor total de tu inventario, productos con stock bajo y agotados.

### 🎟️ 2.2. Cupones de Descuento y Embajadoras (`/admin/coupons`)
- **Creación de Cupones:**
  - Descuentos en porcentaje (`%`) o monto fijo en pesos chilenos (`$ CLP`).
  - Asignación de nombre de afiliada/influencer (ej: *Sofía Muñoz (@sofia_outfits)*).
  - Configuración de monto mínimo de compra en el carrito y límite máximo de usos.
  - Activación o desactivación de cupones con un solo clic.

### 📦 2.3. Control de Pedidos y Despachos (`/admin/orders`)
- Listado de ventas en tiempo real con datos del cliente, dirección de entrega, desglose de productos (con talla y color exactos) y cupón aplicado.
- Estados de orden: `pending`, `paid`, `shipped`, `delivered`, `cancelled`.

### 📧 2.4. Suscriptores y Boletín (`/admin/subscribers`)
- Lista de correos de clientas suscritas para campañas de marketing.

---

## 3. Pagos Automatizados (Mercado Pago)
- Los clientes pagan con Webpay, tarjetas de débito/crédito o saldo Mercado Pago.
- Al confirmarse el pago, la orden se actualiza automáticamente a `paid` y el stock se descuenta en la base de datos sin requerir intervención manual.
