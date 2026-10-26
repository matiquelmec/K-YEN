const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN || ""
});

async function main() {
  await client.execute({
    sql: 'INSERT OR IGNORE INTO coupons (code, discount_type, discount_value, min_cart_amount, usage_limit, is_active, affiliate_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: ['BIENVENIDA10', 'percentage', 10, 0, 100, 1, null]
  });

  await client.execute({
    sql: 'INSERT OR IGNORE INTO coupons (code, discount_type, discount_value, min_cart_amount, usage_limit, is_active, affiliate_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: ['SOFIA15', 'percentage', 15, 30000, 50, 1, 'Sofía Muñoz (@sofia_outfits)']
  });

  const coupons = await client.execute('SELECT * FROM coupons');
  console.log('✅ Cupones registrados con éxito en Turso DB:', coupons.rows);
}

main().then(() => client.close()).catch(console.error);
