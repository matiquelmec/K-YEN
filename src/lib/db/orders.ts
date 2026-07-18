import { turso } from './turso';

export interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_id: string | null;
  total: number;
  shipping_address: any;
  items: any[];
  created_at: string;
  updated_at: string;
}

export interface SubscriberRow {
  id: string;
  email: string;
  created_at: string;
}

export async function dbGetOrders(): Promise<OrderRow[]> {
  const result = await turso.execute('SELECT * FROM orders ORDER BY created_at DESC');
  return (result.rows as any[]).map((row: any) => ({
    id: String(row.id),
    order_number: String(row.order_number),
    status: String(row.status),
    payment_status: String(row.payment_status),
    payment_id: row.payment_id ? String(row.payment_id) : null,
    total: Number(row.total),
    shipping_address: row.shipping_address ? JSON.parse(String(row.shipping_address)) : {},
    items: row.items ? JSON.parse(String(row.items)) : [],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  }));
}

export async function dbGetOrderById(id: string): Promise<OrderRow | null> {
  const result = await turso.execute({
    sql: 'SELECT * FROM orders WHERE id = ? LIMIT 1',
    args: [id]
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0] as any;
  return {
    id: String(row.id),
    order_number: String(row.order_number),
    status: String(row.status),
    payment_status: String(row.payment_status),
    payment_id: row.payment_id ? String(row.payment_id) : null,
    total: Number(row.total),
    shipping_address: row.shipping_address ? JSON.parse(String(row.shipping_address)) : {},
    items: row.items ? JSON.parse(String(row.items)) : [],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  };
}

export async function dbCreateOrder(order: Partial<OrderRow>): Promise<OrderRow> {
  const id = order.id || crypto.randomUUID();
  const order_number = order.order_number || `ORDER-${id.substring(0, 8).toUpperCase()}`;
  const status = order.status || 'pending';
  const payment_status = order.payment_status || 'pending';
  const payment_id = order.payment_id || null;
  const total = order.total || 0;
  const shipping_address = order.shipping_address ? JSON.stringify(order.shipping_address) : '{}';
  const items = order.items ? JSON.stringify(order.items) : '[]';
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();

  await turso.execute({
    sql: `
      INSERT INTO orders (id, order_number, status, payment_status, payment_id, total, shipping_address, items, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [id, order_number, status, payment_status, payment_id, total, shipping_address, items, created_at, updated_at]
  });

  const created = await dbGetOrderById(id);
  if (!created) throw new Error('Failed to retrieve newly created order');
  return created;
}

export async function dbUpdateOrderPayment(id: string, paymentId: string, paymentStatus: string, orderStatus?: string): Promise<void> {
  const updated_at = new Date().toISOString();
  if (orderStatus) {
    await turso.execute({
      sql: 'UPDATE orders SET payment_id = ?, payment_status = ?, status = ?, updated_at = ? WHERE id = ?',
      args: [paymentId, paymentStatus, orderStatus, updated_at, id]
    });
  } else {
    await turso.execute({
      sql: 'UPDATE orders SET payment_id = ?, payment_status = ?, updated_at = ? WHERE id = ?',
      args: [paymentId, paymentStatus, updated_at, id]
    });
  }
}

export async function dbGetSubscribers(): Promise<SubscriberRow[]> {
  const result = await turso.execute('SELECT * FROM subscribers ORDER BY created_at DESC');
  return (result.rows as any[]).map((row: any) => ({
    id: String(row.id),
    email: String(row.email),
    created_at: String(row.created_at)
  }));
}

export async function dbCreateSubscriber(email: string): Promise<SubscriberRow> {
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();

  await turso.execute({
    sql: 'INSERT INTO subscribers (id, email, created_at) VALUES (?, ?, ?)',
    args: [id, email, created_at]
  });

  return { id, email, created_at };
}
