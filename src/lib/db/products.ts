import { turso } from './turso';

export interface ProductRow {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category: string;
  price: number;
  original_price: number | null;
  featured: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
}

// Fallback high-quality images of dresses from Unsplash
const fallbackImages: Record<string, string[]> = {
  gotico: [
    'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
  ],
  primaveral: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80'
  ],
  veraniego: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80'
  ]
};

function mapRowToProduct(row: any): ProductRow {
  const category = row.category || 'gotico';
  const sizes = row.sizes_str ? row.sizes_str.split(',') : ['S', 'M', 'L'];
  const colors = row.colors_str ? row.colors_str.split(',') : ['Negro', 'Blanco'];
  
  let images = row.images_str ? row.images_str.split(',') : [];
  if (images.length === 0 || !images[0]) {
    images = fallbackImages[category] || fallbackImages['gotico'];
  }

  // Calculate generic stock based on variants or default
  const stock = row.stock !== undefined && row.stock !== null ? Number(row.stock) : 15;

  return {
    id: String(row.id),
    sku: row.sku || `SKU-${row.id.substring(0, 8)}`,
    name: row.name,
    slug: row.slug || '',
    description: row.description,
    short_description: row.short_description,
    category: category,
    price: Number(row.price),
    original_price: row.original_price ? Number(row.original_price) : null,
    featured: Boolean(row.featured === 1 || row.featured === true),
    is_active: Boolean(row.is_active === 1 || row.is_active === true),
    rating: row.rating ? Number(row.rating) : 5.0,
    reviews_count: row.reviews_count ? Number(row.reviews_count) : 0,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
    sizes,
    colors,
    images,
    stock
  };
}

export async function dbGetProducts(options: {
  category?: string;
  search?: string;
  sortBy?: string;
  limit?: number;
} = {}): Promise<ProductRow[]> {
  let query = `
    SELECT 
      p.*,
      cat.slug as category,
      (SELECT GROUP_CONCAT(DISTINCT s.name) FROM product_variants pv JOIN sizes s ON pv.size_id = s.id WHERE pv.product_id = p.id) as sizes_str,
      (SELECT GROUP_CONCAT(DISTINCT col.name) FROM product_variants pv JOIN colors col ON pv.color_id = col.id WHERE pv.product_id = p.id) as colors_str,
      (SELECT GROUP_CONCAT(DISTINCT pi.url) FROM product_images pi WHERE pi.product_id = p.id) as images_str
    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE p.is_active = 1
  `;
  const params: any[] = [];

  if (options.category && options.category !== 'all') {
    query += ` AND cat.slug = ?`;
    params.push(options.category);
  }

  if (options.search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    params.push(`%${options.search}%`, `%${options.search}%`);
  }

  if (options.sortBy) {
    if (options.sortBy === 'price_asc') {
      query += ` ORDER BY p.price ASC`;
    } else if (options.sortBy === 'price_desc') {
      query += ` ORDER BY p.price DESC`;
    } else {
      query += ` ORDER BY p.created_at DESC`;
    }
  } else {
    query += ` ORDER BY p.created_at DESC`;
  }

  if (options.limit !== undefined) {
    query += ` LIMIT ?`;
    params.push(options.limit);
  }

  const result = await turso.execute({ sql: query, args: params });
  return (result.rows as any[]).map(mapRowToProduct);
}

export async function dbGetProductById(id: string): Promise<ProductRow | null> {
  const query = `
    SELECT 
      p.*,
      cat.slug as category,
      (SELECT GROUP_CONCAT(DISTINCT s.name) FROM product_variants pv JOIN sizes s ON pv.size_id = s.id WHERE pv.product_id = p.id) as sizes_str,
      (SELECT GROUP_CONCAT(DISTINCT col.name) FROM product_variants pv JOIN colors col ON pv.color_id = col.id WHERE pv.product_id = p.id) as colors_str,
      (SELECT GROUP_CONCAT(DISTINCT pi.url) FROM product_images pi WHERE pi.product_id = p.id) as images_str
    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE p.id = ?
  `;
  const result = await turso.execute({ sql: query, args: [id] });
  if (result.rows.length === 0) return null;
  return mapRowToProduct(result.rows[0]);
}

export async function dbCreateProduct(product: Partial<ProductRow>): Promise<ProductRow> {
  const id = product.id || crypto.randomUUID();
  const sku = product.sku || `SKU-${id.substring(0, 8)}`;
  const name = product.name || '';
  const slug = product.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const description = product.description || '';
  const short_description = product.short_description || '';
  
  // Resolve category_id from category slug
  let categoryId = '';
  const catResult = await turso.execute({
    sql: 'SELECT id FROM categories WHERE slug = ? LIMIT 1',
    args: [product.category || 'gotico']
  });
  if (catResult.rows.length > 0) {
    const catRow = catResult.rows[0] as any;
    categoryId = String(catRow.id);
  } else {
    // Default to first category
    const allCats = await turso.execute('SELECT id FROM categories LIMIT 1');
    const catRow = allCats.rows[0] as any;
    categoryId = allCats.rows.length > 0 ? String(catRow.id) : crypto.randomUUID();
  }

  const price = product.price || 0;
  const original_price = product.original_price || null;
  const featured = product.featured ? 1 : 0;
  const is_active = 1;
  const rating = 5.0;
  const reviews_count = 0;
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();

  await turso.execute({
    sql: `
      INSERT INTO products (
        id, sku, name, slug, description, short_description, category_id, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [id, sku, name, slug, description, short_description, categoryId, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at]
  });

  // If there are custom images, save them
  if (product.images && product.images.length > 0) {
    for (let i = 0; i < product.images.length; i++) {
      const imgUrl = product.images[i];
      if (imgUrl) {
        await turso.execute({
          sql: 'INSERT INTO product_images (id, product_id, url, is_primary, display_order) VALUES (?, ?, ?, ?, ?)',
          args: [crypto.randomUUID(), id, imgUrl, i === 0 ? 1 : 0, i]
        });
      }
    }
  }

  const created = await dbGetProductById(id);
  if (!created) throw new Error('Failed to retrieve newly created product');
  return created;
}

export async function dbUpdateProduct(id: string, product: Partial<ProductRow>): Promise<ProductRow> {
  const existing = await dbGetProductById(id);
  if (!existing) throw new Error('Product not found');

  const name = product.name !== undefined ? product.name : existing.name;
  const slug = product.slug !== undefined ? product.slug : existing.slug;
  const description = product.description !== undefined ? product.description : existing.description;
  const short_description = product.short_description !== undefined ? product.short_description : existing.short_description;
  const price = product.price !== undefined ? product.price : existing.price;
  const original_price = product.original_price !== undefined ? product.original_price : existing.original_price;
  const featured = product.featured !== undefined ? (product.featured ? 1 : 0) : (existing.featured ? 1 : 0);
  const is_active = product.is_active !== undefined ? (product.is_active ? 1 : 0) : (existing.is_active ? 1 : 0);
  const updated_at = new Date().toISOString();

  let categoryId = '';
  if (product.category) {
    const catResult = await turso.execute({
      sql: 'SELECT id FROM categories WHERE slug = ? LIMIT 1',
      args: [product.category]
    });
    if (catResult.rows.length > 0) {
      const catRow = catResult.rows[0] as any;
      categoryId = String(catRow.id);
    }
  }

  if (categoryId) {
    await turso.execute({
      sql: `
        UPDATE products SET 
          name = ?, slug = ?, description = ?, short_description = ?, category_id = ?, price = ?, original_price = ?, featured = ?, is_active = ?, updated_at = ?
        WHERE id = ?
      `,
      args: [name, slug, description, short_description, categoryId, price, original_price, featured, is_active, updated_at, id]
    });
  } else {
    await turso.execute({
      sql: `
        UPDATE products SET 
          name = ?, slug = ?, description = ?, short_description = ?, price = ?, original_price = ?, featured = ?, is_active = ?, updated_at = ?
        WHERE id = ?
      `,
      args: [name, slug, description, short_description, price, original_price, featured, is_active, updated_at, id]
    });
  }

  // Update images if provided
  if (product.images) {
    // Clear old images
    await turso.execute({
      sql: 'DELETE FROM product_images WHERE product_id = ?',
      args: [id]
    });
    // Insert new images
    for (let i = 0; i < product.images.length; i++) {
      const imgUrl = product.images[i];
      if (imgUrl) {
        await turso.execute({
          sql: 'INSERT INTO product_images (id, product_id, url, is_primary, display_order) VALUES (?, ?, ?, ?, ?)',
          args: [crypto.randomUUID(), id, imgUrl, i === 0 ? 1 : 0, i]
        });
      }
    }
  }

  const updated = await dbGetProductById(id);
  if (!updated) throw new Error('Failed to retrieve updated product');
  return updated;
}

export async function dbDeleteProduct(id: string): Promise<void> {
  await turso.execute({
    sql: 'DELETE FROM products WHERE id = ?',
    args: [id]
  });
}
