import { type NextRequest, NextResponse } from 'next/server';
import { getFlowPaymentStatus } from '@/lib/flow';
import { dbConfirmOrderPaymentAndDeductStock, dbGetOrderById } from '@/lib/db/orders';
import { turso } from '@/lib/db/turso';

/**
 * Endpoint de retorno de Flow (urlReturn).
 * Flow redirige al cliente mediante un POST con `token` en application/x-www-form-urlencoded.
 * Este handler valida el estado en Flow, asegura la conciliación en Turso DB
 * y redirige con HTTP 303 (See Other - GET) a la página correspondiente.
 */
export async function POST(req: NextRequest) {
  return handleReturn(req);
}

export async function GET(req: NextRequest) {
  return handleReturn(req);
}

async function handleReturn(req: NextRequest) {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin).replace(/\/$/, '');

  try {
    let token = '';

    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        token = String(formData.get('token') || '');
      } else {
        const body = await req.json().catch(() => ({}));
        token = String(body.token || '');
      }
    }

    if (!token) {
      const url = new URL(req.url);
      token = url.searchParams.get('token') || '';
    }

    if (!token) {
      console.warn('⚠️ Flow urlReturn invocado sin token');
      return NextResponse.redirect(`${siteUrl}/checkout/failure`, { status: 303 });
    }

    // Consultar estado oficial en Flow
    const statusData = await getFlowPaymentStatus(token);
    const { status, commerceOrder, flowOrder } = statusData;

    let targetPath = '/checkout/pending';

    if (status === 2) {
      // 2: Pagada
      await dbConfirmOrderPaymentAndDeductStock(commerceOrder, 'approved', 'paid', String(flowOrder));
      targetPath = '/checkout/success';
    } else if (status === 1) {
      // 1: Pendiente
      targetPath = '/checkout/pending';
    } else if (status === 3 || status === 4) {
      // 3: Rechazada, 4: Anulada
      await dbConfirmOrderPaymentAndDeductStock(
        commerceOrder,
        status === 3 ? 'rejected' : 'cancelled',
        'cancelled',
        String(flowOrder)
      );
      targetPath = '/checkout/failure';
    }

    // Buscar ID interno de la orden para que /checkout/success cargue los detalles completos
    let orderLookupId = commerceOrder;
    try {
      const orderRes = await turso.execute({
        sql: 'SELECT id FROM orders WHERE order_number = ? OR payment_id = ? LIMIT 1',
        args: [commerceOrder, token],
      });
      if (orderRes.rows.length > 0 && orderRes.rows[0]) {
        orderLookupId = String(orderRes.rows[0].id);
      }
    } catch (e) {
      console.warn('Error resolviendo order ID en retorno Flow:', e);
    }

    const redirectUrl = `${siteUrl}${targetPath}?order_id=${encodeURIComponent(orderLookupId)}`;
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error: any) {
    console.error('Error en Flow urlReturn handler:', error);
    return NextResponse.redirect(`${siteUrl}/checkout/failure?error=${encodeURIComponent(error.message || 'Error de pasarela')}`, {
      status: 303,
    });
  }
}
