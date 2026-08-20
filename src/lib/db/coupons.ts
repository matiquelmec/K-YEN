import { turso } from './turso';

export interface CouponRow {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_cart_amount: number;
  usage_limit: number | null;
  usage_count: number;
  expires_at: string | null;
  is_active: boolean;
  affiliate_name: string | null;
  created_at: string;
  total_orders?: number;
  total_sales?: number;
}

/**
 * Asegurar que la tabla coupons exista en Turso DB
 */
export async function ensureCouponsTable(): Promise<void> {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount_type TEXT NOT NULL DEFAULT 'percentage',
      discount_value REAL NOT NULL,
      min_cart_amount REAL DEFAULT 0,
      usage_limit INTEGER,
      usage_count INTEGER DEFAULT 0,
      expires_at TEXT,
      is_active INTEGER DEFAULT 1,
      affiliate_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function dbGetCoupons(): Promise<CouponRow[]> {
  await ensureCouponsTable();

  const { rows: coupons } = await turso.execute('SELECT * FROM coupons ORDER BY created_at DESC');

  // Obtener ventas asociadas por cupón desde orders
  const salesMap = new Map<string, { orders: number; sales: number }>();
  try {
    const { rows: salesStats } = await turso.execute(`
      SELECT coupon_code, COUNT(id) as total_orders, SUM(total) as total_sales 
      FROM orders 
      WHERE (payment_status = 'approved' OR payment_status = 'completed' OR payment_status = 'paid') 
        AND coupon_code IS NOT NULL 
      GROUP BY coupon_code
    `);
    salesStats.forEach((row: any) => {
      salesMap.set(String(row.coupon_code).toUpperCase(), {
        orders: Number(row.total_orders || 0),
        sales: Number(row.total_sales || 0)
      });
    });
  } catch (err) {
    // Si la columna coupon_code aún no existe en orders en local, continuar
  }

  return (coupons as any[]).map((c: any) => {
    const codeUpper = String(c.code).toUpperCase();
    const stats = salesMap.get(codeUpper) || { orders: 0, sales: 0 };

    return {
      code: String(c.code),
      discount_type: (c.discount_type as 'percentage' | 'fixed') || 'percentage',
      discount_value: Number(c.discount_value),
      min_cart_amount: Number(c.min_cart_amount || 0),
      usage_limit: c.usage_limit !== null && c.usage_limit !== undefined ? Number(c.usage_limit) : null,
      usage_count: Number(c.usage_count || 0),
      expires_at: c.expires_at ? String(c.expires_at) : null,
      is_active: Boolean(c.is_active === 1 || String(c.is_active) === 'true'),
      affiliate_name: c.affiliate_name ? String(c.affiliate_name) : null,
      created_at: String(c.created_at),
      total_orders: stats.orders,
      total_sales: stats.sales
    };
  });
}

export async function dbCreateCoupon(coupon: {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_cart_amount?: number;
  usage_limit?: number | null;
  expires_at?: string | null;
  is_active?: boolean;
  affiliate_name?: string | null;
}): Promise<void> {
  await ensureCouponsTable();

  const codeUpper = coupon.code.trim().toUpperCase();

  const existing = await turso.execute({
    sql: 'SELECT code FROM coupons WHERE code = ? LIMIT 1',
    args: [codeUpper]
  });

  if (existing.rows.length > 0) {
    throw new Error('Ya existe un cupón con este código.');
  }

  await turso.execute({
    sql: `INSERT INTO coupons (
      code, discount_type, discount_value, min_cart_amount, usage_limit, expires_at, is_active, affiliate_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      codeUpper,
      coupon.discount_type,
      Number(coupon.discount_value),
      Number(coupon.min_cart_amount || 0),
      coupon.usage_limit ? Number(coupon.usage_limit) : null,
      coupon.expires_at || null,
      coupon.is_active !== false ? 1 : 0,
      coupon.affiliate_name || null
    ]
  });
}

export async function dbUpdateCoupon(code: string, coupon: {
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_cart_amount?: number;
  usage_limit?: number | null;
  expires_at?: string | null;
  is_active?: boolean;
  affiliate_name?: string | null;
}): Promise<void> {
  await ensureCouponsTable();

  const codeUpper = code.trim().toUpperCase();

  await turso.execute({
    sql: `UPDATE coupons SET 
      discount_type = ?, 
      discount_value = ?, 
      min_cart_amount = ?, 
      usage_limit = ?, 
      expires_at = ?, 
      is_active = ?, 
      affiliate_name = ? 
    WHERE code = ?`,
    args: [
      coupon.discount_type,
      Number(coupon.discount_value),
      Number(coupon.min_cart_amount || 0),
      coupon.usage_limit ? Number(coupon.usage_limit) : null,
      coupon.expires_at || null,
      coupon.is_active ? 1 : 0,
      coupon.affiliate_name || null,
      codeUpper
    ]
  });
}

export async function dbDeleteCoupon(code: string): Promise<void> {
  await ensureCouponsTable();

  const codeUpper = code.trim().toUpperCase();
  await turso.execute({
    sql: 'DELETE FROM coupons WHERE code = ?',
    args: [codeUpper]
  });
}
