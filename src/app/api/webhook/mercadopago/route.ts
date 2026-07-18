import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { turso } from '@/lib/db/turso';

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

    if ((type === 'payment' || topic === 'payment') && paymentId) {
      // Query payment details from Mercado Pago
      const payment = await new Payment(client).get({ id: paymentId });
      const externalReference = payment.external_reference; // This matches the paymentId generated at checkout
      const status = payment.status;

      console.log('💳 Estado del pago de Mercado Pago:', {
        paymentId,
        externalReference,
        status,
      });

      if (externalReference) {
        // Update order in Turso
        const dbStatus = status === 'approved' ? 'paid' : 'pending';
        const refStr = String(externalReference);
        const statusStr = String(status || 'pending');
        
        const result = await turso.execute({
          sql: 'UPDATE orders SET payment_status = ?, status = ?, updated_at = ? WHERE payment_id = ?',
          args: [statusStr, dbStatus, new Date().toISOString(), refStr]
        });

        console.log('✅ Orden actualizada en base de datos de Turso:', result.rowsAffected, 'filas afectadas');
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
