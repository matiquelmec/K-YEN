const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const url = 'libsql://kuyen-matiquelmec.aws-us-east-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODQ0MDAyMDUsImlkIjoiMDE5Zjc2ODYtN2QwMS03YTQ5LWE3ZDItYjUyYWU2NDhmMjA3Iiwia2lkIjoibjBMa1BDaDBkNmRfR0Z1ZDQtSjFjMjBZZWlkLTVqSEN0T1VGcmk3YWVzUSIsInJpZCI6ImNhZWU5YjZkLWFlZjktNGM0OC05MWRmLWQ3Y2U2YzU4ZjgxMiJ9.uF4Fmj8F1L6Hk_S9FTKsZKsk7NBbNhV9tlLECvEK1LoepCSK2XlfZlWgAMkuUC0vpCXdiWE2AAudoH0AHi8zAw';

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
