import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { dbConfirmOrderPaymentAndDeductStock } from '@/lib/db/orders';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || req.headers.get('x-type');
    const topic = searchParams.get('topic');

    // Parse the body
    const body = await req.json().catch(() => ({}));
    console.log('🔔 Webhook Mercado Pago recibido:', { type, topic, body });

    // Identify payment id
    const paymentId = body.data?.id || body.id;

    if ((type === 'payment' || topic === 'payment' || body.action === 'payment.updated' || body.action === 'payment.created') && paymentId) {
      if (!process.env.MP_ACCESS_TOKEN) {
        console.warn('⚠️ MP_ACCESS_TOKEN no configurado en Webhook');
        return NextResponse.json({ received: true });
      }

      // Query payment details from Mercado Pago
      const payment = await new Payment(client).get({ id: paymentId });
      const externalReference = payment.external_reference; // Matches payment_id generated at checkout
      const status = payment.status;

      console.log('💳 Estado del pago verificado con Mercado Pago:', {
        paymentId,
        externalReference,
        status,
        transaction_amount: payment.transaction_amount
      });

      if (externalReference) {
        const orderStatus = status === 'approved' ? 'paid' : status === 'rejected' || status === 'cancelled' ? 'cancelled' : 'pending';
        const paymentStatusStr = String(status || 'pending');
        
        // Actualización atómica en Turso y descuento de stock
        const updated = await dbConfirmOrderPaymentAndDeductStock(
          String(externalReference),
          paymentStatusStr,
          orderStatus
        );

        if (updated) {
          console.log(`✅ Orden ${externalReference} actualizada a ${orderStatus} con stock descontado en Turso`);
        } else {
          console.warn(`⚠️ No se encontró la orden con external_reference: ${externalReference}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: `Webhook handling failed: ${error.message}` },
      { status: 500 }
    );
  }
}
