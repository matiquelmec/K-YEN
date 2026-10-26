const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN || ""
});

async function main() {
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('✅ Tablas activas en Turso DB:', tables.rows.map(r => r.name));

  // Asegurar tabla coupons
  await client.execute(`
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

  const couponsInfo = await client.execute("PRAGMA table_info(coupons)");
  console.log('\n--- Esquema de la tabla coupons (Afiliadas y Descuentos) ---');
  console.table(couponsInfo.rows);

  const couponsData = await client.execute("SELECT * FROM coupons");
  console.log(`\n📋 Cupones actualmente registrados (${couponsData.rows.length}):`, couponsData.rows);

  // Comprobar si orders tiene columnas para cupón y descuento
  const ordersInfo = await client.execute("PRAGMA table_info(orders)");
  console.log('\n--- Esquema de la tabla orders ---');
  console.table(ordersInfo.rows);
}

main().then(() => client.close()).catch(console.error);
