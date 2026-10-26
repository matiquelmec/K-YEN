import { type NextRequest, NextResponse } from 'next/server';
import { dbGetOrderById } from '@/lib/db/orders';
import { verifyJWT } from '@/lib/auth';
import { turso } from '@/lib/db/turso';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const order = await dbGetOrderById(resolvedParams.id);
    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Si es administrador autenticado, retornar orden completa
    const token = request.cookies.get('kuyen_admin_session')?.value;
    const isAdmin = token ? await verifyJWT(token) : false;

    if (isAdmin) {
      return NextResponse.json(order);
    }

    // Para la vista pública de confirmación de clienta (checkout/success),
    // sanitizar y retornar solo datos pertinentes de la confirmación
    const sanitizedOrder = {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      total: order.total,
      created_at: order.created_at,
      items: (order.items || []).map((item: any) => ({
        product_name: item.product_name || item.name || '',
        quantity: item.quantity || 1,
        price: item.price || 0,
        size: item.size || 'Standard',
        color: item.color || 'Standard',
        image: item.image || ''
      }))
    };

    return NextResponse.json(sanitizedOrder);
  } catch (error: any) {
    console.error('Error in GET /api/orders/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const resolvedParams = await params;
    await turso.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = ? WHERE id = ?',
      args: [status, new Date().toISOString(), resolvedParams.id]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in PUT /api/orders/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
