const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const url = process.env.TURSO_CONNECTION_URL || process.env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || '';

const client = createClient({
  url: url,
  authToken: authToken
});

async function main() {
  console.log("⏳ Leyendo archivo turso_bootstrap.sql...");
  const sqlPath = path.join(__dirname, '../supabase/turso_bootstrap.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  
  console.log("🚀 Enviando comandos SQL a la base de datos de Turso...");
  await client.executeMultiple(sql);
  
  console.log("🎉 ¡Base de datos de Turso inicializada y poblada con éxito!");
  client.close();
}

main().catch(err => {
  console.error("❌ Error durante la inicialización de Turso:", err);
  process.exit(1);
});
