const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://kilkdvsuvaulqoyoxcsi.supabase.co';
const supabaseKey = 'sb_secret_Wz-3zQfUO5baM2R6J2LHZQ_5snTgnjL';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('🚀 Creating KÜYEN database tables...');

    // Create products table
    const { error: productsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          original_price DECIMAL(10,2),
          category VARCHAR(100) NOT NULL,
          sizes TEXT[] NOT NULL DEFAULT '{}',
          colors TEXT[] NOT NULL DEFAULT '{}',
          images TEXT[] NOT NULL DEFAULT '{}',
          stock INTEGER DEFAULT 0,
          rating DECIMAL(3,2),
          reviews_count INTEGER DEFAULT 0,
          is_new BOOLEAN DEFAULT false,
          is_sale BOOLEAN DEFAULT false,
          tags TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    });

    if (productsError && !productsError.message.includes('already exists')) {
      console.error('Error creating products table:', productsError);
      return;
    }

    console.log('✅ Products table created!');

    // Insert sample products
    const { error: insertError } = await supabase.from('products').upsert([
      {
        id: 1,
        name: 'Vestido Luna Nocturna',
        description: 'Elegancia misteriosa con detalles de encaje y corte que abraza cada curva. Perfecto para ocasiones especiales donde quieres destacar con sensualidad gótica.',
        price: 89990,
        original_price: 109990,
        category: 'gotico',
        sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
        colors: ['Negro', 'Borgoña', 'Azul Medianoche'],
        images: [
          'https://images.unsplash.com/photo-1566479179817-0ddb5fa87cd9?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'
        ],
        stock: 25,
        rating: 4.8,
        reviews_count: 127,
        is_new: false,
        is_sale: true,
        tags: ['elegante', 'nocturno', 'encaje', 'gotico']
      },
      {
        id: 2,
        name: 'Vestido Flor de Cerezo',
        description: 'Frescura natural con estampado floral y silueta que fluye con tu movimiento. Ideal para días primaverales donde quieres sentirte libre.',
        price: 74990,
        original_price: null,
        category: 'primaveral',
        sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
        colors: ['Rosa Suave', 'Verde Menta', 'Lavanda'],
        images: [
          'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1594226801341-41427b4e6c22?w=600&h=800&fit=crop'
        ],
        stock: 30,
        rating: 4.9,
        reviews_count: 89,
        is_new: true,
        is_sale: false,
        tags: ['floral', 'fresco', 'natural', 'primavera']
      },
      {
        id: 3,
        name: 'Vestido Sol Radiante',
        description: 'Libertad solar con tela ligera y corte que celebra tu feminidad. Perfecto para días de verano donde quieres brillar.',
        price: 69990,
        original_price: null,
        category: 'veraniego',
        sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
        colors: ['Dorado', 'Coral', 'Turquesa'],
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&h=800&fit=crop'
        ],
        stock: 20,
        rating: 4.7,
        reviews_count: 156,
        is_new: false,
        is_sale: false,
        tags: ['verano', 'ligero', 'luminoso', 'solar']
      },
      {
        id: 4,
        name: 'Vestido Tierra Ancestral',
        description: 'Conexión profunda con detalles bordados y silueta que honra tus raíces. Diseñado especialmente para tallas grandes.',
        price: 94990,
        original_price: null,
        category: 'gotico',
        sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
        colors: ['Tierra', 'Cobre', 'Óxido'],
        images: [
          'https://images.unsplash.com/photo-1594226801341-41427b4e6c22?w=600&h=800&fit=crop',
          'https://images.unsplash.com/photo-1566479179817-0ddb5fa87cd9?w=600&h=800&fit=crop'
        ],
        stock: 15,
        rating: 4.9,
        reviews_count: 203,
        is_new: false,
        is_sale: false,
        tags: ['artesanal', 'bordado', 'ancestral', 'tallas-grandes']
      },
      {
        id: 5,
        name: 'Vestido Místico Lunar',
        description: 'Energía lunar con transparencias estratégicas y corte que realza tu silueta. Especial para noches mágicas.',
        price: 119990,
        original_price: null,
        category: 'gotico',
        sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
        colors: ['Negro Lunar', 'Plateado', 'Azul Profundo'],
        images: [
          'https://images.unsplash.com/photo-1566479179817-0ddb5fa87cd9?w=600&h=800&fit=crop'
        ],
        stock: 12,
        rating: 4.8,
        reviews_count: 76,
        is_new: true,
        is_sale: false,
        tags: ['mistico', 'lunar', 'transparencias', 'premium']
      },
      {
        id: 6,
        name: 'Vestido Brisa Marina',
        description: 'Frescura oceánica con corte fluido y detalles que danzan con el viento. Ideal para días costeros.',
        price: 79990,
        original_price: 89990,
        category: 'veraniego',
        sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
        colors: ['Azul Océano', 'Verde Agua', 'Blanco Espuma'],
        images: [
          'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&h=800&fit=crop'
        ],
        stock: 35,
        rating: 4.6,
        reviews_count: 134,
        is_new: false,
        is_sale: true,
        tags: ['marino', 'fresco', 'fluido', 'costero']
      }
    ], { onConflict: 'id' });

    if (insertError) {
      console.error('Error inserting products:', insertError);
      return;
    }

    console.log('✅ Sample products inserted!');

    // Verify data
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    console.log(`🎉 Database setup complete! Created ${data.length} products.`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTables();