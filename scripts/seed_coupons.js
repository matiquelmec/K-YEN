const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://kuyen-matiquelmec.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODQ0MDAyMDUsImlkIjoiMDE5Zjc2ODYtN2QwMS03YTQ5LWE3ZDItYjUyYWU2NDhmMjA3Iiwia2lkIjoibjBMa1BDaDBkNmRfR0Z1ZDQtSjFjMjBZZWlkLTVqSEN0T1VGcmk3YWVzUSIsInJpZCI6ImNhZWU5YjZkLWFlZjktNGM0OC05MWRmLWQ3Y2U2YzU4ZjgxMiJ9.uF4Fmj8F1L6Hk_S9FTKsZKsk7NBbNhV9tlLECvEK1LoepCSK2XlfZlWgAMkuUC0vpCXdiWE2AAudoH0AHi8zAw'
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
