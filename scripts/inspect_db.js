const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Maty182094420.@db.kilkdvsuvaulqoyoxcsi.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString,
});

async function inspect() {
    await client.connect();

    const res = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'orders';
  `);

    console.log('Orders Table Schema:');
    console.table(res.rows);

    await client.end();
}

inspect().catch(err => console.error(err));
