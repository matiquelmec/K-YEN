const { createClient } = require('@libsql/client');

const url = process.env.TURSO_CONNECTION_URL || process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || '';

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
