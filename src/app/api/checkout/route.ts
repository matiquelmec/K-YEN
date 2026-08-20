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

    const { items, customerInfo } = await req.json();

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

    let totalAmount = 0;
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
      totalAmount += itemTotal;

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

    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, "");
    const internalOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. PERSISTIR LA ORDEN EN BASE DE DATOS ANTES DE REDIRIGIR (Atómico - Estándar JoyasJP)
    const savedOrder = await dbCreateOrder({
      order_number: internalOrderId,
      status: 'pending',
      payment_status: 'pending',
      payment_id: internalOrderId, // external_reference
      total: totalAmount,
      shipping_address: customerInfo || {},
      items: orderItems
    });

    const preferenceBody: any = {
      items: validatedItems,
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
