const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up KÜYEN database...');

    // Read the schema file
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by statements and execute them one by one
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });

          if (error) {
            console.warn(`⚠️  Warning in statement ${i + 1}:`, error.message);
            // Continue with non-critical errors
            if (!error.message.includes('already exists') && !error.message.includes('does not exist')) {
              console.error('Critical error:', error);
            }
          }
        } catch (err) {
          console.warn(`⚠️  Warning in statement ${i + 1}:`, err.message);
        }
      }
    }

    console.log('✅ Database setup completed!');
    console.log('🎉 KÜYEN e-commerce database is ready!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Alternative setup using direct SQL execution
async function setupDatabaseDirect() {
  try {
    console.log('🚀 Setting up KÜYEN database with direct SQL...');

    // Check if products table exists
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'products');

    if (tables && tables.length > 0) {
      console.log('✅ Database tables already exist!');

      // Verify with a simple query
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

      if (!error) {
        console.log(`📊 Found ${products.length > 0 ? 'existing' : 'empty'} products table`);
        console.log('🎉 Database is ready!');
        return;
      }
    }

    console.log('📝 Tables not found, database setup may be needed.');
    console.log('ℹ️  Please run the schema.sql file manually in Supabase dashboard.');

  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabaseDirect();