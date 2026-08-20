const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://kuyen-matiquelmec.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODQ0MDAyMDUsImlkIjoiMDE5Zjc2ODYtN2QwMS03YTQ5LWE3ZDItYjUyYWU2NDhmMjA3Iiwia2lkIjoibjBMa1BDaDBkNmRfR0Z1ZDQtSjFjMjBZZWlkLTVqSEN0T1VGcmk3YWVzUSIsInJpZCI6ImNhZWU5YjZkLWFlZjktNGM0OC05MWRmLWQ3Y2U2YzU4ZjgxMiJ9.uF4Fmj8F1L6Hk_S9FTKsZKsk7NBbNhV9tlLECvEK1LoepCSK2XlfZlWgAMkuUC0vpCXdiWE2AAudoH0AHi8zAw'
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
