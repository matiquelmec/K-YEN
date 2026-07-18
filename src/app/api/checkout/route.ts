import { MercadoPagoConfig, Preference } from 'mercadopago';
import { type NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: NextRequest) {
  try {
    const { items, customerInfo } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Mercado Pago credentials not configured' }, { status: 500 });
    }

    // Validate prices server-side
    const productIds = items.map((item: any) => item.product.id);
    const placeholders = productIds.map(() => '?').join(',');
    
    const dbResult = await turso.execute({
      sql: `SELECT id, price, name, stock FROM products WHERE id IN (${placeholders})`,
      args: productIds
    });

    const dbProducts = dbResult.rows;

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: 'Error al validar productos en la base de datos' }, { status: 500 });
    }

    const validatedItems = items.map((item: any) => {
      const dbProduct = dbProducts.find((p: any) => String(p.id) === String(item.product.id));
      if (!dbProduct) {
        throw new Error(`Producto no encontrado: ${item.product.name}`);
      }

      // SQLite might return numeric types or strings depending on driver. Let's ensure types.
      const dbPrice = Number(dbProduct.price);
      const dbStock = Number(dbProduct.stock ?? 15);

      if (dbStock < item.quantity) {
        throw new Error(`Stock insuficiente para: ${dbProduct.name}`);
      }

      return {
        id: String(dbProduct.id),
        title: String(dbProduct.name),
        quantity: item.quantity,
        unit_price: dbPrice,
        currency_id: 'CLP',
        picture_url: item.product.images?.[0] || '',
        description: `Talla: ${item.selectedSize} / Color: ${item.selectedColor}`,
      };
    });

    const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, "");
    const internalOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const preferenceBody: any = {
      items: validatedItems,
      back_urls: {
        success: `${siteUrl}/checkout/success`,
        failure: `${siteUrl}/checkout/failure`,
        pending: `${siteUrl}/checkout/pending`,
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
          street_name: customerInfo.address,
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
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: `Error al procesar checkout: ${error.message || 'Desconocido'}` },
      { status: 500 }
    );
  }
}
