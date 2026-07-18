import { type NextRequest, NextResponse } from 'next/server';
import { dbGetOrders, dbCreateOrder } from '@/lib/db/orders';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const orders = await dbGetOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await dbCreateOrder(body);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
