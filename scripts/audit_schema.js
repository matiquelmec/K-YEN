const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://kuyen-matiquelmec.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODQ0MDAyMDUsImlkIjoiMDE5Zjc2ODYtN2QwMS03YTQ5LWE3ZDItYjUyYWU2NDhmMjA3Iiwia2lkIjoibjBMa1BDaDBkNmRfR0Z1ZDQtSjFjMjBZZWlkLTVqSEN0T1VGcmk3YWVzUSIsInJpZCI6ImNhZWU5YjZkLWFlZjktNGM0OC05MWRmLWQ3Y2U2YzU4ZjgxMiJ9.uF4Fmj8F1L6Hk_S9FTKsZKsk7NBbNhV9tlLECvEK1LoepCSK2XlfZlWgAMkuUC0vpCXdiWE2AAudoH0AHi8zAw'
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
