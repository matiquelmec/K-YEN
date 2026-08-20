const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://kuyen-matiquelmec.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODQ0MDAyMDUsImlkIjoiMDE5Zjc2ODYtN2QwMS03YTQ5LWE3ZDItYjUyYWU2NDhmMjA3Iiwia2lkIjoibjBMa1BDaDBkNmRfR0Z1ZDQtSjFjMjBZZWlkLTVqSEN0T1VGcmk3YWVzUSIsInJpZCI6ImNhZWU5YjZkLWFlZjktNGM0OC05MWRmLWQ3Y2U2YzU4ZjgxMiJ9.uF4Fmj8F1L6Hk_S9FTKsZKsk7NBbNhV9tlLECvEK1LoepCSK2XlfZlWgAMkuUC0vpCXdiWE2AAudoH0AHi8zAw'
});

async function main() {
  console.log('🚀 Iniciando test de conectividad real para persistencia de variantes...');

  // 1. Tomar el último producto 'asdasd' o crear uno de prueba
  const lastProdRes = await client.execute("SELECT id, name FROM products WHERE name = 'asdasd' LIMIT 1");
  if (lastProdRes.rows.length === 0) {
    console.log('No se encontró producto asdasd para test');
    return;
  }
  const prodId = String(lastProdRes.rows[0].id);
  console.log(`📌 Producto encontrado: ${prodId}`);

  // 2. Simular syncProductVariants para ['XS', '2XL', '6XL'] y ['Borgoña', 'Lavanda', 'Rosa Suave']
  const testSizes = ['XS', '2XL', '6XL'];
  const testColors = ['Borgoña', 'Lavanda', 'Rosa Suave'];

  const sizeMap = new Map();
  for (const s of testSizes) {
    const res = await client.execute({ sql: 'SELECT id FROM sizes WHERE name = ? LIMIT 1', args: [s] });
    if (res.rows.length > 0) sizeMap.set(s, String(res.rows[0].id));
  }

  const colorMap = new Map();
  for (const c of testColors) {
    const res = await client.execute({ sql: 'SELECT id FROM colors WHERE name = ? LIMIT 1', args: [c] });
    if (res.rows.length > 0) colorMap.set(c, String(res.rows[0].id));
  }

  console.log(`Sizes resueltos:`, Object.fromEntries(sizeMap));
  console.log(`Colors resueltos:`, Object.fromEntries(colorMap));

  // Limpiar variantes previas
  await client.execute({ sql: 'DELETE FROM product_variants WHERE product_id = ?', args: [prodId] });

  // Insertar variantes
  for (const [sName, sId] of sizeMap.entries()) {
    for (const [cName, cId] of colorMap.entries()) {
      const vSku = `TEST-${sName}-${cName}`;
      await client.execute({
        sql: `INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available) VALUES (?, ?, ?, ?, ?, 15, 1)`,
        args: [crypto.randomUUID(), prodId, sId, cId, vSku]
      });
    }
  }

  // 3. Consultar con la query que usa el catálogo
  const query = `
    SELECT 
      p.id, p.name,
      (SELECT GROUP_CONCAT(DISTINCT s.name) FROM product_variants pv JOIN sizes s ON pv.size_id = s.id WHERE pv.product_id = p.id) as sizes_str,
      (SELECT GROUP_CONCAT(DISTINCT col.name) FROM product_variants pv JOIN colors col ON pv.color_id = col.id WHERE pv.product_id = p.id) as colors_str
    FROM products p
    WHERE p.id = ?
  `;

  const queryRes = await client.execute({ sql: query, args: [prodId] });
  console.log(`\n🎉 Resultado de la query del Catálogo/Detalle:`, queryRes.rows[0]);

  const parsedSizes = queryRes.rows[0].sizes_str.split(',');
  const parsedColors = queryRes.rows[0].colors_str.split(',');

  console.log(`✅ Tallas persistidas y leídas:`, parsedSizes);
  console.log(`✅ Colores persistidos y leídos:`, parsedColors);
}

main().then(() => client.close()).catch(console.error);
