import { MercadoPagoConfig, Preference } from 'mercadopago';
import { type NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';
import { dbCreateOrder } from '@/lib/db/orders';
import { checkRateLimit } from '@/lib/rate-limit';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

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

    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Mercado Pago credentials not configured' }, { status: 500 });
    }

    // 2. Validate prices and stock server-side
    const productIds = items.map((item: any) => item.product?.id || item.id);
    const placeholders = productIds.map(() => '?').join(',');
    
    const dbResult = await turso.execute({
      sql: `SELECT id, price, name, stock FROM products WHERE id IN (${placeholders})`,
      args: productIds
    });

    const dbProducts = dbResult.rows;

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: 'Error al validar productos en la base de datos' }, { status: 500 });
    }

    let subtotalAmount = 0;
    const orderItems: any[] = [];

    const validatedItems = items.map((item: any) => {
      const prodId = item.product?.id || item.id;
      const dbProduct = dbProducts.find((p: any) => String(p.id) === String(prodId));
      if (!dbProduct) {
        throw new Error(`Producto no encontrado: ${item.product?.name || item.name || prodId}`);
      }

      const dbPrice = Number(dbProduct.price);
      const dbStock = Number(dbProduct.stock ?? 15);

      if (dbStock < item.quantity) {
        throw new Error(`Stock insuficiente para: ${dbProduct.name}. Disponibles: ${dbStock}`);
      }

      const itemTotal = dbPrice * item.quantity;
      subtotalAmount += itemTotal;

      orderItems.push({
        product_id: String(dbProduct.id),
        product_name: String(dbProduct.name),
        price: dbPrice,
        quantity: item.quantity,
        size: item.selectedSize || 'Standard',
        color: item.selectedColor || 'Standard',
        image: item.product?.images?.[0] || ''
      });

      return {
        id: String(dbProduct.id),
        title: String(dbProduct.name),
        quantity: item.quantity,
        unit_price: dbPrice,
        currency_id: 'CLP',
        picture_url: item.product?.images?.[0] || '',
        description: `Talla: ${item.selectedSize || 'N/A'} / Color: ${item.selectedColor || 'N/A'}`,
      };
    });

    // 3. Validar Cupón de Descuento en Base de Datos (Strict Server-Side)
    let discountAmount = 0;
    let validCouponCode: string | null = null;

    if (couponCode) {
      const upperCode = String(couponCode).trim().toUpperCase();
      const couponRes = await turso.execute({
        sql: 'SELECT * FROM coupons WHERE code = ? AND is_active = 1 LIMIT 1',
        args: [upperCode]
      });

      if (couponRes.rows.length > 0) {
        const coupon = couponRes.rows[0] as any;
        const minCart = Number(coupon.min_cart_amount || 0);

        if (subtotalAmount >= minCart) {
          const discVal = Number(coupon.discount_value);
          if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round(subtotalAmount * (discVal / 100));
          } else {
            discountAmount = discVal;
          }
          discountAmount = Math.min(discountAmount, subtotalAmount); // No puede ser mayor al subtotal
          validCouponCode = upperCode;

          // Registrar uso del cupón
          await turso.execute({
            sql: 'UPDATE coupons SET usage_count = COALESCE(usage_count, 0) + 1 WHERE code = ?',
            args: [upperCode]
          });
        }
      }
    }

    const finalTotalAmount = Math.max(0, subtotalAmount - discountAmount);

    // Si hay descuento, ajustar proporcionalmente los items para Mercado Pago
    let mpItems = validatedItems;
    if (discountAmount > 0) {
      const discountRatio = (subtotalAmount - discountAmount) / subtotalAmount;
      mpItems = validatedItems.map((it: any) => ({
        ...it,
        unit_price: Math.round(it.unit_price * discountRatio)
      }));
    }

    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, "");
    const internalOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. PERSISTIR LA ORDEN EN BASE DE DATOS ANTES DE REDIRIGIR (Atómico - Estándar JoyasJP)
    const savedOrder = await dbCreateOrder({
      order_number: internalOrderId,
      status: 'pending',
      payment_status: 'pending',
      payment_id: internalOrderId, // external_reference
      total: finalTotalAmount,
      shipping_address: {
        ...(customerInfo || {}),
        coupon_code: validCouponCode,
        discount_applied: discountAmount
      },
      items: orderItems
    });

    const preferenceBody: any = {
      items: mpItems,
      back_urls: {
        success: `${siteUrl}/checkout/success?order_id=${savedOrder.id}`,
        failure: `${siteUrl}/checkout/failure?order_id=${savedOrder.id}`,
        pending: `${siteUrl}/checkout/pending?order_id=${savedOrder.id}`,
      },
      statement_descriptor: 'KÜYEN TIENDA',
      external_reference: internalOrderId,
      notification_url: `${siteUrl}/api/webhook/mercadopago`,
      auto_return: 'approved',
    };

    if (customerInfo) {
      preferenceBody.payer = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: {
          number: customerInfo.phone,
        },
        address: {
          street_name: customerInfo.address || '',
          zip_code: '',
          street_number: '',
        },
      };
    }

    const preference = await new Preference(client).create({
      body: preferenceBody,
    });

    return NextResponse.json({
      checkoutUrl: preference.init_point,
      orderId: preference.id,
      paymentId: internalOrderId,
      dbOrderId: savedOrder.id
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: `Error al procesar checkout: ${error.message || 'Desconocido'}` },
      { status: 500 }
    );
  }
}
