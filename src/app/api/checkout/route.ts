import { type NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';
import { dbCreateOrder } from '@/lib/db/orders';
import { checkRateLimit } from '@/lib/rate-limit';
import { createFlowPayment } from '@/lib/flow';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (10 peticiones por minuto)
    const rateLimit = checkRateLimit(req, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes de checkout. Por favor espera unos momentos.' },
        { status: 429 }
      );
    }

    const { items, customerInfo, couponCode } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    if (!process.env.FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
      return NextResponse.json({ error: 'Credenciales de Flow no configuradas' }, { status: 500 });
    }

    // 2. Validate prices and stock server-side
    const productIds = items.map((item: any) => item.product?.id || item.id);
    const placeholders = productIds.map(() => '?').join(',');

    const dbResult = await turso.execute({
      sql: `SELECT id, price, name, stock FROM products WHERE id IN (${placeholders})`,
      args: productIds,
    });

    const dbProducts = dbResult.rows;

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: 'Error al validar productos en la base de datos' }, { status: 500 });
    }

    let subtotalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const prodId = item.product?.id || item.id;
      const dbProduct = dbProducts.find((p: any) => String(p.id) === String(prodId));
      if (!dbProduct) {
        throw new Error(`Producto no encontrado: ${item.product?.name || item.name || prodId}`);
      }

      const dbPrice = Number(dbProduct.price);
      const dbStock = Number(dbProduct.stock ?? 15);
      const qty = Number(item.quantity || 1);

      if (dbStock < qty) {
        throw new Error(`Stock insuficiente para: ${dbProduct.name}. Disponibles: ${dbStock}`);
      }

      const itemSize = item.selectedSize || 'Standard';
      const itemColor = item.selectedColor || 'Standard';

      // Validar stock específico de variante si existe en product_variants
      if (itemSize !== 'Standard' || itemColor !== 'Standard') {
        const variantRes = await turso.execute({
          sql: `
            SELECT pv.stock_quantity 
            FROM product_variants pv
            JOIN sizes s ON pv.size_id = s.id
            JOIN colors c ON pv.color_id = c.id
            WHERE pv.product_id = ? AND s.name = ? AND c.name = ?
            LIMIT 1
          `,
          args: [String(dbProduct.id), itemSize, itemColor],
        });

        if (variantRes.rows.length > 0 && variantRes.rows[0]) {
          const variantStock = Number(variantRes.rows[0].stock_quantity ?? 0);
          if (variantStock < qty) {
            throw new Error(`Stock insuficiente para ${dbProduct.name} (Talla: ${itemSize}, Color: ${itemColor}). Disponibles: ${variantStock}`);
          }
        }
      }

      const itemTotal = dbPrice * qty;
      subtotalAmount += itemTotal;

      orderItems.push({
        product_id: String(dbProduct.id),
        product_name: String(dbProduct.name),
        price: dbPrice,
        quantity: qty,
        size: itemSize,
        color: itemColor,
        image: item.product?.images?.[0] || '',
      });
    }

    // 3. Validar Cupón de Descuento en Base de Datos (Strict Server-Side con expiración y límite)
    let discountAmount = 0;
    let validCouponCode: string | null = null;

    if (couponCode) {
      const upperCode = String(couponCode).trim().toUpperCase();
      const couponRes = await turso.execute({
        sql: 'SELECT * FROM coupons WHERE code = ? AND is_active = 1 LIMIT 1',
        args: [upperCode],
      });

      if (couponRes.rows.length > 0) {
        const coupon = couponRes.rows[0] as any;
        const minCart = Number(coupon.min_cart_amount || 0);

        const isExpired = coupon.expires_at ? new Date(coupon.expires_at) < new Date() : false;
        const isUsageExceeded =
          coupon.usage_limit !== null && coupon.usage_limit !== undefined
            ? Number(coupon.usage_count || 0) >= Number(coupon.usage_limit)
            : false;

        if (!isExpired && !isUsageExceeded && subtotalAmount >= minCart) {
          const discVal = Number(coupon.discount_value);
          if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round(subtotalAmount * (discVal / 100));
          } else {
            discountAmount = discVal;
          }
          discountAmount = Math.min(discountAmount, subtotalAmount);
          validCouponCode = upperCode;
        }
      }
    }

    const finalTotalAmount = Math.max(0, subtotalAmount - discountAmount);
    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, '');
    const internalOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. PERSISTIR LA ORDEN EN BASE DE DATOS ANTES DE REDIRIGIR A FLOW (Atómico)
    const savedOrder = await dbCreateOrder({
      order_number: internalOrderId,
      status: 'pending',
      payment_status: 'pending',
      payment_id: internalOrderId,
      total: finalTotalAmount,
      shipping_address: {
        ...(customerInfo || {}),
        coupon_code: validCouponCode,
        discount_applied: discountAmount,
      },
      items: orderItems,
    });

    // 5. Crear orden de pago en Flow.cl (Monto total exacto sin problemas de redondeo)
    const payerEmail = customerInfo?.email || 'contacto@casaaira.cl';
    const totalItemsCount = orderItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
    const subject = `Casa Aira Boutique: Pedido ${internalOrderId} (${totalItemsCount} prenda${totalItemsCount > 1 ? 's' : ''})`;

    const flowPayment = await createFlowPayment({
      commerceOrder: internalOrderId,
      subject,
      currency: 'CLP',
      amount: finalTotalAmount,
      email: payerEmail,
      urlConfirmation: `${siteUrl}/api/webhook/flow`,
      urlReturn: `${siteUrl}/api/flow/return`,
      optional: {
        dbOrderId: savedOrder.id,
        customerName: `${customerInfo?.firstName || ''} ${customerInfo?.lastName || ''}`.trim(),
      },
    });

    // Guardar el token de Flow en la orden para trazabilidad rápida
    await turso.execute({
      sql: 'UPDATE orders SET payment_id = ? WHERE id = ?',
      args: [flowPayment.token, savedOrder.id],
    });

    return NextResponse.json({
      checkoutUrl: flowPayment.redirectUrl,
      orderId: flowPayment.token,
      paymentId: internalOrderId,
      dbOrderId: savedOrder.id,
      flowOrder: flowPayment.flowOrder,
    });
  } catch (error: any) {
    console.error('Checkout API error (Flow):', error);
    return NextResponse.json(
      { error: `Error al procesar checkout: ${error.message || 'Desconocido'}` },
      { status: 500 }
    );
  }
}
