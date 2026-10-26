import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 1. Categorías
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// 2. Productos / Vestidos
export const products = sqliteTable('products', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
  price: integer('price').notNull(), // Precios en CLP enteros
  originalPrice: integer('original_price'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  stock: integer('stock').notNull().default(15),
  rating: real('rating').notNull().default(5.0),
  reviewsCount: integer('reviews_count').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => [
  index('idx_products_slug').on(table.slug),
  index('idx_products_category').on(table.categoryId),
  index('idx_products_active_featured').on(table.isActive, table.featured),
]);

// 3. Tallas
export const sizes = sqliteTable('sizes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  isPlusSize: integer('is_plus_size', { mode: 'boolean' }).notNull().default(false),
});

// 4. Colores
export const colors = sqliteTable('colors', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  hexCode: text('hex_code').notNull().default('#6B7280'),
  displayOrder: integer('display_order').notNull().default(0),
});

// 5. Variantes de Producto (Talla x Color x Stock)
export const productVariants = sqliteTable('product_variants', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sizeId: text('size_id').notNull().references(() => sizes.id, { onDelete: 'cascade' }),
  colorId: text('color_id').notNull().references(() => colors.id, { onDelete: 'cascade' }),
  skuVariant: text('sku_variant').notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(10),
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => [
  index('idx_variants_product_id').on(table.productId),
  index('idx_variants_size_color').on(table.sizeId, table.colorId),
]);

// 6. Imágenes de Producto
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
}, (table) => [
  index('idx_images_product_id').on(table.productId),
]);

// 7. Órdenes
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: text('order_number').notNull().unique(),
  status: text('status').notNull().default('pending'), // 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
  paymentStatus: text('payment_status').notNull().default('pending'), // 'pending', 'approved', 'rejected', 'refunded'
  paymentId: text('payment_id'),
  total: integer('total').notNull(),
  shippingAddress: text('shipping_address').notNull().default('{}'), // JSON serializado
  items: text('items').notNull().default('[]'), // JSON serializado
  couponCode: text('coupon_code'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => [
  index('idx_orders_order_number').on(table.orderNumber),
  index('idx_orders_payment_id').on(table.paymentId),
  index('idx_orders_status').on(table.status),
]);

// 8. Cupones
export const coupons = sqliteTable('coupons', {
  code: text('code').primaryKey(),
  discountType: text('discount_type').notNull().default('percentage'), // 'percentage' | 'fixed'
  discountValue: real('discount_value').notNull(),
  minCartAmount: real('min_cart_amount').default(0),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  expiresAt: text('expires_at'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  affiliateName: text('affiliate_name'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// 9. Suscriptoras Newsletter Club Casa Aira
export const subscribers = sqliteTable('subscribers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// 10. Configuración Tienda y Redes
export const storeSettings = sqliteTable('store_settings', {
  id: text('id').primaryKey().$defaultFn(() => 'main'),
  contactEmail: text('contact_email').notNull(),
  contactPhone: text('contact_phone').notNull(),
  contactWhatsapp: text('contact_whatsapp').notNull(),
  instagramUrl: text('instagram_url').notNull(),
  facebookUrl: text('facebook_url').notNull(),
  tiktokUrl: text('tiktok_url').notNull(),
  pinterestUrl: text('pinterest_url'),
  address: text('address'),
  announcementText: text('announcement_text'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// 11. Colecciones de Portada
export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  number: text('number').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  tag: text('tag').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  categoryId: text('category_id').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// 12. Manifiesto y Asesoría
export const manifestoSettings = sqliteTable('manifesto_settings', {
  id: text('id').primaryKey().$defaultFn(() => 'main'),
  badge: text('badge').notNull(),
  titlePrimary: text('title_primary').notNull(),
  titleHighlight: text('title_highlight').notNull(),
  description: text('description').notNull(),
  pillarsJson: text('pillars_json').notNull(),
  cardImage: text('card_image').notNull(),
  cardBadge: text('card_badge').notNull(),
  cardSubtitle: text('card_subtitle').notNull(),
  cardTitle: text('card_title').notNull(),
  cardDescription: text('card_description').notNull(),
  catalogButtonText: text('catalog_button_text').notNull(),
  catalogButtonLink: text('catalog_button_link').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  whatsappMessage: text('whatsapp_message').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// 13. Experiencia Unboxing
export const unboxingSettings = sqliteTable('unboxing_settings', {
  id: text('id').primaryKey().$defaultFn(() => 'main'),
  badge: text('badge').notNull(),
  titlePrimary: text('title_primary').notNull(),
  titleHighlight: text('title_highlight').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  imageBadge: text('image_badge').notNull(),
  featuresJson: text('features_json').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// --- RELACIONES DRIZZLE ---
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
