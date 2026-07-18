const { createClient } = require('@libsql/client');

const url = 'libsql://kuyen-matiquelmec.aws-us-east-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODQ0MDAyMDUsImlkIjoiMDE5Zjc2ODYtN2QwMS03YTQ5LWE3ZDItYjUyYWU2NDhmMjA3Iiwia2lkIjoibjBMa1BDaDBkNmRfR0Z1ZDQtSjFjMjBZZWlkLTVqSEN0T1VGcmk3YWVzUSIsInJpZCI6ImNhZWU5YjZkLWFlZjktNGM0OC05MWRmLWQ3Y2U2YzU4ZjgxMiJ9.uF4Fmj8F1L6Hk_S9FTKsZKsk7NBbNhV9tlLECvEK1LoepCSK2XlfZlWgAMkuUC0vpCXdiWE2AAudoH0AHi8zAw';

const client = createClient({
  url: url,
  authToken: authToken
});

async function main() {
  const q = `
    SELECT 
      p.id, p.name, p.price,
      cat.slug as category,
      (SELECT GROUP_CONCAT(DISTINCT s.name) FROM product_variants pv JOIN sizes s ON pv.size_id = s.id WHERE pv.product_id = p.id) as sizes_str,
      (SELECT GROUP_CONCAT(DISTINCT col.name) FROM product_variants pv JOIN colors col ON pv.color_id = col.id WHERE pv.product_id = p.id) as colors_str,
      (SELECT GROUP_CONCAT(DISTINCT pi.url) FROM product_images pi WHERE pi.product_id = p.id) as images_str
    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.id
  `;
  const res = await client.execute(q);
  console.log("Query results:", JSON.stringify(res.rows, null, 2));
  client.close();
}

main().catch(console.error);
