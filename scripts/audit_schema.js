const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN || ""
});

async function main() {
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Tables:', tables.rows.map(r => r.name));

  for (const t of ['sizes', 'colors', 'product_variants', 'product_images', 'products']) {
    try {
      const info = await client.execute(`PRAGMA table_info(${t})`);
      console.log(`\n--- Schema of ${t} ---`);
      console.table(info.rows);
      const data = await client.execute(`SELECT * FROM ${t} LIMIT 3`);
      console.log(`Sample data of ${t}:`, data.rows);
    } catch (e) {
      console.error(`Error on ${t}:`, e.message);
    }
  }
}
main().then(() => client.close());
