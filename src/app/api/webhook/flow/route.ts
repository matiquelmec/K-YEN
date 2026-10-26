import { type NextRequest, NextResponse } from 'next/server';
import { getFlowPaymentStatus } from '@/lib/flow';
import { dbConfirmOrderPaymentAndDeductStock } from '@/lib/db/orders';
import { turso } from '@/lib/db/turso';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let token = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      token = String(formData.get('token') || '');
    } else {
      const body = await req.json().catch(() => ({}));
      token = String(body.token || '');
    }

    if (!token) {
      const url = new URL(req.url);
      token = url.searchParams.get('token') || '';
    }

    if (!token) {
      console.warn('⚠️ Webhook Flow recibido sin token');
      return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    console.log(`🔔 Webhook Flow recibido para token: ${token}`);

    // Consultar el estado oficial a los servidores de Flow de forma segura
    const statusData = await getFlowPaymentStatus(token);
    const { status, commerceOrder, flowOrder, amount } = statusData;

    console.log('💳 Estado de transacción Flow verificado:', {
      flowOrder,
      commerceOrder,
      status,
      amount,
    });

    // Mapear status de Flow:
    // 1: Pendiente, 2: Pagada, 3: Rechazada, 4: Anulada
    let orderStatus = 'pending';
    let paymentStatusStr = 'pending';

    if (status === 2) {
      orderStatus = 'paid';
      paymentStatusStr = 'approved';
    } else if (status === 3) {
      orderStatus = 'cancelled';
      paymentStatusStr = 'rejected';
    } else if (status === 4) {
      orderStatus = 'cancelled';
      paymentStatusStr = 'cancelled';
    }

    // Validar monto contra la orden en base de datos si fue pagada
    if (orderStatus === 'paid') {
      const orderRes = await turso.execute({
        sql: 'SELECT total FROM orders WHERE order_number = ? OR payment_id = ? LIMIT 1',
        args: [commerceOrder, token],
      });

      if (orderRes.rows.length > 0 && orderRes.rows[0]) {
        const expectedTotal = Number(orderRes.rows[0].total);
        if (Math.abs(expectedTotal - amount) > 1) {
          console.error(`🚨 Discrepancia de monto en Flow: Esperado ${expectedTotal}, Recibido ${amount}`);
          return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
        }
      }
    }

    // Actualización atómica en Turso DB y deducción de stock
    const updated = await dbConfirmOrderPaymentAndDeductStock(
      commerceOrder,
      paymentStatusStr,
      orderStatus,
      String(flowOrder)
    );

    if (updated) {
      console.log(`✅ Orden Flow ${commerceOrder} conciliada como ${orderStatus} (Flow ID: ${flowOrder})`);
    } else {
      console.warn(`⚠️ No se pudo conciliar la orden con referencia: ${commerceOrder}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('❌ Error procesando Webhook de Flow:', error);
    return NextResponse.json(
      { error: `Flow webhook error: ${error.message}` },
      { status: 500 }
    );
  }
}
