const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Maty182094420.@db.kilkdvsuvaulqoyoxcsi.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders';
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
