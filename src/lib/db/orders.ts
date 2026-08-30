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

export async function dbConfirmOrderPaymentAndDeductStock(paymentId: string, paymentStatus: string, orderStatus: string): Promise<boolean> {
  const updated_at = new Date().toISOString();
  
  // Buscar orden por payment_id (o external_reference)
  const result = await turso.execute({
    sql: 'SELECT * FROM orders WHERE payment_id = ? OR id = ? LIMIT 1',
    args: [paymentId, paymentId]
  });

  if (result.rows.length === 0) return false;
  const row = result.rows[0] as any;
  const items: any[] = row.items ? JSON.parse(String(row.items)) : [];
  const shippingAddress: any = row.shipping_address ? JSON.parse(String(row.shipping_address)) : {};
  const currentStatus = String(row.status);
  const couponCode = row.coupon_code || shippingAddress.coupon_code;

  // Si ya fue marcada como 'paid', evitamos doble descuento de stock (idempotencia)
  if (currentStatus === 'paid') {
    await turso.execute({
      sql: 'UPDATE orders SET payment_status = ?, updated_at = ? WHERE id = ?',
      args: [paymentStatus, updated_at, String(row.id)]
    });
    return true;
  }

  const statements: any[] = [
    {
      sql: 'UPDATE orders SET payment_status = ?, status = ?, updated_at = ? WHERE id = ?',
      args: [paymentStatus, orderStatus, updated_at, String(row.id)]
    }
  ];

  // Si el pago es aprobado, descontar stock de cada producto y variante atómicamente
  if (orderStatus === 'paid') {
    // 1. Incrementar uso del cupón si se aplicó
    if (couponCode) {
      statements.push({
        sql: 'UPDATE coupons SET usage_count = COALESCE(usage_count, 0) + 1 WHERE code = ?',
        args: [String(couponCode).toUpperCase().trim()]
      });
    }

    // 2. Descontar stock general y variantes
    for (const item of items) {
      const prodId = item.product_id || item.product?.id;
      const qty = item.quantity || 1;
      const size = item.size || item.selectedSize;
      const color = item.color || item.selectedColor;

      if (prodId) {
        // Descuento global en products
        statements.push({
          sql: 'UPDATE products SET stock = MAX(0, COALESCE(stock, 15) - ?) WHERE id = ?',
          args: [qty, String(prodId)]
        });

        // Descuento en la matriz de product_variants
        if (size && color) {
          statements.push({
            sql: `
              UPDATE product_variants 
              SET stock_quantity = MAX(0, COALESCE(stock_quantity, 10) - ?) 
              WHERE product_id = ? 
                AND size_id IN (SELECT id FROM sizes WHERE name = ?) 
                AND color_id IN (SELECT id FROM colors WHERE name = ?)
            `,
            args: [qty, String(prodId), String(size), String(color)]
          });
        }
      }
    }
  }

  await turso.batch(statements, 'write');
  return true;
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
