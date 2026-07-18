import { type NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/db/turso';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 1. Get products count
    const productsRes = await turso.execute('SELECT COUNT(*) as count FROM products WHERE is_active = 1');
    const totalProducts = Number(productsRes.rows[0]?.count || 0);

    // 2. Get orders
    const ordersRes = await turso.execute('SELECT id, order_number, status, payment_status, total, shipping_address, created_at FROM orders ORDER BY created_at DESC');
    const orders = ordersRes.rows.map((row: any) => ({
      id: String(row.id),
      order_number: row.order_number,
      status: row.status,
      payment_status: row.payment_status,
      total: Number(row.total),
      shipping_address: row.shipping_address ? JSON.parse(row.shipping_address) : {},
      created_at: row.created_at
    }));

    // Calculate revenue (sum of paid/approved orders)
    const totalRevenue = orders.reduce((sum, order) => {
      const isPaid = order.status === 'paid' || order.payment_status === 'approved' || order.status === 'delivered';
      return sum + (isPaid ? order.total : 0);
    }, 0);

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts,
      recentOrders: orders.slice(0, 5)
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
