const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kilkdvsuvaulqoyoxcsi.supabase.co';
const supabaseKey = 'sb_publishable_R7jHTGhDjoGfawl2NRSyGA_Z7JprZhL';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndPopulate() {
  try {
    console.log('🔍 Checking if products table exists...');

    // Try to select from products table
    const { data: existingProducts, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Products table does not exist or has errors:', error.message);
      console.log('ℹ️ You need to run the schema.sql file in Supabase dashboard first.');
      return;
    }

    console.log('✅ Products table exists!');

    if (existingProducts && existingProducts.length > 0) {
      console.log(`📊 Found ${existingProducts.length} existing product(s)`);

      // Get all products
      const { data: allProducts } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (allProducts && allProducts.length > 0) {
        console.log(`🎉 Database already has ${allProducts.length} products! Ready to use.`);
        console.log('Products:', allProducts.map(p => `${p.id}. ${p.name} - $${p.price}`));
        return;
      }
    }

    console.log('📝 Products table is empty, adding sample products...');

    // Insert sample products
    const sampleProducts = [
      {
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
    ];

    const { data, error: insertError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (insertError) {
      console.error('❌ Error inserting products:', insertError);
      return;
    }

    console.log(`✅ Successfully inserted ${data.length} products!`);
    console.log('🎉 KÜYEN e-commerce database is ready!');
    console.log('Products created:', data.map(p => `${p.id}. ${p.name} - $${p.price}`));

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAndPopulate();