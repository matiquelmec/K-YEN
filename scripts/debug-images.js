const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars manually
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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImages() {
    try {
        console.log('🔍 Fetching products to inspect image URLs...');
        const { data: products, error } = await supabase.from('products').select('id, name, images').limit(3);

        if (error) {
            console.error('❌ Error fetching products:', error.message);
        } else {
            console.log('✅ Products fetched. Inspecting images:');
            products.forEach(p => {
                console.log(`\nProduct: ${p.name} (ID: ${p.id})`);
                console.log(`Images:`, p.images);
            });
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

checkImages();
