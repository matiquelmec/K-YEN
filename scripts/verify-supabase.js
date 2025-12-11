const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars manually to avoid dotenv dependency issues if not configured
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY; // Fallback to service role if anon not found, just for test

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

console.log(`Testing connection to: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
    try {
        // Try to fetch a public table or just check health
        // Using a simple query that should return something or an empty list, not error
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Connection failed:', error.message);
            // Try another table if products doesn't exist?
            // Check if it's a 404 or auth error.
        } else {
            console.log('✅ Connection Sucessful! Supabase is reachable.');
            console.log(`   (Verified access to 'products' table)`);
        }

        // Also check auth service status implicitly?
        // const { data: { session }, error: authError } = await supabase.auth.getSession();
        // if (authError) console.error('Warning: Auth check failed', authError.message);

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

verifyConnection();
