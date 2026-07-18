-- 🌙 TURSO BOOTSTRAP SCHEMA & SEED DATA (KÜYEN)

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS colors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hex_code TEXT,
    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sizes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    bust_cm INTEGER,
    waist_cm INTEGER,
    hips_cm INTEGER,
    is_plus_size INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    size_id TEXT NOT NULL,
    color_id TEXT NOT NULL,
    sku_variant TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_available INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY(size_id) REFERENCES sizes(id) ON DELETE CASCADE,
    FOREIGN KEY(color_id) REFERENCES colors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_id TEXT,
    total REAL NOT NULL,
    shipping_address TEXT,
    items TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data from PostgreSQL Backup
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active, created_at, updated_at) VALUES ('1aca99f1-28ba-4fd1-a037-611fdbfa1bd6', 'Vestidos de Noche', 'vestidos-noche', 'Elegancia para ocasiones especiales', NULL, '1', 1, '2025-11-22 20:19:32.74439+00', '2025-11-22 20:19:32.74439+00');
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active, created_at, updated_at) VALUES ('c8417c6c-e051-4379-acf9-d576c598212d', 'Vestidos Casuales', 'vestidos-casual', 'Comodidad y estilo para el día a día', NULL, '2', 1, '2025-11-22 20:19:32.74439+00', '2025-11-22 20:19:32.74439+00');
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active, created_at, updated_at) VALUES ('dd51566e-0cfa-47b0-bce2-b3ddc8672040', 'Vestidos de Fiesta', 'vestidos-fiesta', 'Diseños únicos para celebrar', NULL, '3', 1, '2025-11-22 20:19:32.74439+00', '2025-11-22 20:19:32.74439+00');
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active, created_at, updated_at) VALUES ('bc7f8f06-4a47-40b4-b68d-ccd8e1aab5b0', 'Vestidos de Trabajo', 'vestidos-trabajo', 'Profesionalismo y elegancia', NULL, '4', 1, '2025-11-22 20:19:32.74439+00', '2025-11-22 20:19:32.74439+00');
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active, created_at, updated_at) VALUES ('9eb2f2d9-4ba6-46a1-a985-f21f72a00cdd', 'Colección Gótica', 'gotico', 'Misterio y elegancia oscura', NULL, '5', 1, '2025-11-22 20:19:32.74439+00', '2025-11-22 20:19:32.74439+00');
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active, created_at, updated_at) VALUES ('c7f3b1a7-3dbd-43e6-b921-6066327ae8c1', 'Colección Primaveral', 'primaveral', 'Frescura y colores vibrantes', NULL, '6', 1, '2025-11-22 20:19:32.74439+00', '2025-11-22 20:19:32.74439+00');
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active, created_at, updated_at) VALUES ('83f8c3e3-3a1a-431f-ac47-57de4feb19d4', 'Colección Veraniega', 'veraniego', 'Ligereza para días soleados', NULL, '7', 1, '2025-11-22 20:19:32.74439+00', '2025-11-22 20:19:32.74439+00');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'Negro', '#000000', '1');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'Blanco', '#FFFFFF', '2');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'Azul Noche', '#0F172A', '3');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('aa3ce5a2-3cbc-4e37-aae2-698a944e2de9', 'Rosa Luna', '#F8BBD9', '4');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('cd4c8460-a59e-4fd2-8c9d-86976ce50e09', 'Verde Terra', '#16A34A', '5');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('aa2ac6ab-d41f-43b5-9f72-d0b3f4463fc6', 'Dorado Místico', '#F59E0B', '6');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('084115f4-f21e-46f6-bc69-07e265b1182a', 'Borgoña', '#800020', '7');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('2bd10ef7-4f3c-4fb4-8d7f-cd5cbc7462d3', 'Azul Medianoche', '#191970', '8');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('ded23515-649f-4e22-8dda-c4c3041e61cb', 'Rosa Suave', '#FFB6C1', '9');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('1241d696-d6f9-4ede-8a65-c8b1a533c79d', 'Verde Menta', '#98FB98', '10');
INSERT INTO colors (id, name, hex_code, display_order) VALUES ('a3e85157-2f6d-4a72-9ca7-e97b4c0ca0cc', 'Lavanda', '#E6E6FA', '11');
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('3d763de0-ba95-4290-aa91-f35e70bed31a', 'XS', '1', '80', '60', '86', 0);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('13727f44-6d9a-4918-9442-c84aa07358b6', 'S', '2', '84', '64', '90', 0);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('773b670f-f2ae-44ee-8be2-78b0495abdda', 'M', '3', '88', '68', '94', 0);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'L', '4', '92', '72', '98', 0);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('ea4eab4c-8605-4334-aee9-d27b117208a9', 'XL', '5', '96', '76', '102', 0);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('c2ba11a5-5f15-4bb1-8537-db432b4f4cc7', '2XL', '6', '100', '80', '106', 1);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('22563cf4-c766-47dd-804b-f0b4e88cd053', '3XL', '7', '104', '84', '110', 1);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('52ead88c-42e3-4da7-9175-9459d3dad04a', '4XL', '8', '108', '88', '114', 1);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('2e46e9a7-171a-4c49-8d27-f40cb4e46a52', '5XL', '9', '112', '92', '118', 1);
INSERT INTO sizes (id, name, display_order, bust_cm, waist_cm, hips_cm, is_plus_size) VALUES ('849ca5e3-7e96-4539-9b69-333d988ef897', '6XL', '10', '116', '96', '122', 1);
INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at) VALUES ('861b213c-c159-4116-9b86-ba5ed845ef94', 'VLN001', 'Vestido Luna Nocturna', 'vestido-luna-nocturna', 'Elegancia misteriosa con detalles de encaje y corte que abraza cada curva. Perfecto para ocasiones especiales donde quieres destacar con sofisticación.', 'Elegancia misteriosa con detalles de encaje', '9eb2f2d9-4ba6-46a1-a985-f21f72a00cdd', '89990.00', '109990.00', 1, 1, '4.8', '127', '2025-11-22 20:20:54.837058+00', '2025-11-22 20:20:54.837058+00');
INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at) VALUES ('33773e11-6dd5-4b72-a0a0-f9ad0ca81381', 'VFC001', 'Vestido Flor de Cerezo', 'vestido-flor-cerezo', 'Frescura natural con estampado floral y silueta que fluye con tu movimiento. Ideal para primavera y días especiales.', 'Frescura natural con estampado floral', 'c7f3b1a7-3dbd-43e6-b921-6066327ae8c1', '74990.00', NULL, 1, 1, '4.9', '89', '2025-11-22 20:20:59.759829+00', '2025-11-22 20:20:59.759829+00');
INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at) VALUES ('7f322f6e-c0cb-417b-a9bf-bc829b778ff4', 'VSR001', 'Vestido Sol Radiante', 'vestido-sol-radiante', 'Libertad solar con tela ligera y corte que celebra tu feminidad. Perfecto para el verano.', 'Libertad solar con tela ligera', '83f8c3e3-3a1a-431f-ac47-57de4feb19d4', '69990.00', NULL, 0, 1, '4.7', '156', '2025-11-22 20:21:04.293619+00', '2025-11-22 20:21:04.293619+00');
INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at) VALUES ('2eab38a1-277c-473f-8d6e-5e1626df04d2', 'VTA001', 'Vestido Tierra Ancestral', 'vestido-tierra-ancestral', 'Conexión profunda con detalles bordados y silueta que honra tus raíces.', 'Conexión profunda con detalles bordados', '9eb2f2d9-4ba6-46a1-a985-f21f72a00cdd', '94990.00', NULL, 1, 1, '4.9', '203', '2025-11-22 20:21:08.820998+00', '2025-11-22 20:21:08.820998+00');
INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at) VALUES ('eab07c01-f03e-4b51-a0ff-d26d80ea5582', 'VBM001', 'Vestido Brisa Marina', 'vestido-brisa-marina', 'Inspirado en las olas del mar, perfecto para tallas grandes con máxima comodidad.', 'Inspirado en las olas del mar', '83f8c3e3-3a1a-431f-ac47-57de4feb19d4', '79990.00', NULL, 1, 1, '4.8', '142', '2025-11-22 20:21:13.252392+00', '2025-11-22 20:21:13.252392+00');
INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, featured, is_active, rating, reviews_count, created_at, updated_at) VALUES ('b91fea47-fb40-420e-997e-4d5a89e6f85e', 'VJS001', 'Vestido Jardín Secreto', 'vestido-jardin-secreto', 'Diseño exclusivo para tallas grandes que realza la belleza natural.', 'Diseño exclusivo que realza la belleza natural', 'c7f3b1a7-3dbd-43e6-b921-6066327ae8c1', '84990.00', '99990.00', 0, 1, '4.9', '98', '2025-11-22 20:21:17.651387+00', '2025-11-22 20:21:17.651387+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('2e900e30-dee1-4753-b9b8-4990fb2f60f4', '861b213c-c159-4116-9b86-ba5ed845ef94', '3d763de0-ba95-4290-aa91-f35e70bed31a', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VLN001-XS-Negro', '9', 1, '2025-11-22 20:20:55.552463+00', '2025-11-22 20:20:55.552463+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('4cf2cca4-da0a-4219-8594-74940672c698', '861b213c-c159-4116-9b86-ba5ed845ef94', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VLN001-XS-Blanco', '19', 1, '2025-11-22 20:20:56.267749+00', '2025-11-22 20:20:56.267749+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('735254b0-5e89-4e78-963c-7e2337aedeaa', '861b213c-c159-4116-9b86-ba5ed845ef94', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VLN001-XS-AzulNoche', '10', 1, '2025-11-22 20:20:56.591411+00', '2025-11-22 20:20:56.591411+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('2befbb68-9ba8-4f46-80d1-4e2496a31b57', '861b213c-c159-4116-9b86-ba5ed845ef94', '13727f44-6d9a-4918-9442-c84aa07358b6', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VLN001-S-Negro', '11', 1, '2025-11-22 20:20:56.898497+00', '2025-11-22 20:20:56.898497+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('3b12fcb6-9b98-4251-8c23-ba7c4ef77d4f', '861b213c-c159-4116-9b86-ba5ed845ef94', '13727f44-6d9a-4918-9442-c84aa07358b6', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VLN001-S-Blanco', '8', 1, '2025-11-22 20:20:57.226862+00', '2025-11-22 20:20:57.226862+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('37823526-8298-4773-b4a3-11a7da82d316', '861b213c-c159-4116-9b86-ba5ed845ef94', '13727f44-6d9a-4918-9442-c84aa07358b6', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VLN001-S-AzulNoche', '8', 1, '2025-11-22 20:20:57.522222+00', '2025-11-22 20:20:57.522222+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('49e9da9c-d314-4c18-b90d-513e21151943', '861b213c-c159-4116-9b86-ba5ed845ef94', '773b670f-f2ae-44ee-8be2-78b0495abdda', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VLN001-M-Negro', '11', 1, '2025-11-22 20:20:57.847554+00', '2025-11-22 20:20:57.847554+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('75d740a9-e78b-485f-a7fc-95847f9f22c2', '861b213c-c159-4116-9b86-ba5ed845ef94', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VLN001-M-Blanco', '8', 1, '2025-11-22 20:20:58.154838+00', '2025-11-22 20:20:58.154838+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('b2b6586e-bf98-42a3-8983-ba0447aaf2f1', '861b213c-c159-4116-9b86-ba5ed845ef94', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VLN001-M-AzulNoche', '5', 1, '2025-11-22 20:20:58.470761+00', '2025-11-22 20:20:58.470761+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('844884e8-22e0-41c4-99b0-9c9dcb1a2f42', '861b213c-c159-4116-9b86-ba5ed845ef94', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VLN001-L-Negro', '6', 1, '2025-11-22 20:20:58.798847+00', '2025-11-22 20:20:58.798847+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('eafdc278-cea6-44fd-b386-8e09f1ef3bd9', '861b213c-c159-4116-9b86-ba5ed845ef94', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VLN001-L-Blanco', '7', 1, '2025-11-22 20:20:59.120355+00', '2025-11-22 20:20:59.120355+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('d51ef985-b95b-43c3-88c5-9ed2dd44f692', '861b213c-c159-4116-9b86-ba5ed845ef94', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VLN001-L-AzulNoche', '19', 1, '2025-11-22 20:20:59.413128+00', '2025-11-22 20:20:59.413128+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('b5507d0b-9e12-4dd9-be75-afd0a7c92597', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '3d763de0-ba95-4290-aa91-f35e70bed31a', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VFC001-XS-Negro', '15', 1, '2025-11-22 20:21:00.465018+00', '2025-11-22 20:21:00.465018+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('9450e06d-ef8e-4fea-b995-dadf673345e4', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VFC001-XS-Blanco', '11', 1, '2025-11-22 20:21:00.772605+00', '2025-11-22 20:21:00.772605+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('8b8f480a-859d-4afb-bf7e-ad6b67d7bafb', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VFC001-XS-AzulNoche', '13', 1, '2025-11-22 20:21:01.092802+00', '2025-11-22 20:21:01.092802+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('2053f36f-92f8-424f-b1a7-ac2c54c27ee6', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '13727f44-6d9a-4918-9442-c84aa07358b6', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VFC001-S-Negro', '8', 1, '2025-11-22 20:21:01.387464+00', '2025-11-22 20:21:01.387464+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('3eebb9f0-3470-43a5-aaf8-2904753ff9c8', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '13727f44-6d9a-4918-9442-c84aa07358b6', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VFC001-S-Blanco', '18', 1, '2025-11-22 20:21:01.717325+00', '2025-11-22 20:21:01.717325+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('03c77afa-2c5b-4c23-b201-69f65c730fb7', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '13727f44-6d9a-4918-9442-c84aa07358b6', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VFC001-S-AzulNoche', '16', 1, '2025-11-22 20:21:02.015853+00', '2025-11-22 20:21:02.015853+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('de283b68-7fae-4d18-8aa2-7daf20d51186', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '773b670f-f2ae-44ee-8be2-78b0495abdda', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VFC001-M-Negro', '13', 1, '2025-11-22 20:21:02.343925+00', '2025-11-22 20:21:02.343925+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('c6f124f3-1e06-4a63-b135-3ea6d92c5a74', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VFC001-M-Blanco', '12', 1, '2025-11-22 20:21:02.653868+00', '2025-11-22 20:21:02.653868+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('79ac8b50-9f7b-4ad3-84ef-0bc7ba8ae190', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VFC001-M-AzulNoche', '19', 1, '2025-11-22 20:21:02.979425+00', '2025-11-22 20:21:02.979425+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('3044aecb-680e-452d-84d1-5c8fa58bbb4e', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VFC001-L-Negro', '8', 1, '2025-11-22 20:21:03.286398+00', '2025-11-22 20:21:03.286398+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('9073f38e-3462-409f-b47c-35d31ff1b633', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VFC001-L-Blanco', '7', 1, '2025-11-22 20:21:03.62652+00', '2025-11-22 20:21:03.62652+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('638469c6-b1a0-4480-a113-ea613dc122f8', '33773e11-6dd5-4b72-a0a0-f9ad0ca81381', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VFC001-L-AzulNoche', '5', 1, '2025-11-22 20:21:03.943201+00', '2025-11-22 20:21:03.943201+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('8acdee23-b89d-4aae-8ee4-c7acf1cd1811', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '3d763de0-ba95-4290-aa91-f35e70bed31a', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VSR001-XS-Negro', '17', 1, '2025-11-22 20:21:04.966714+00', '2025-11-22 20:21:04.966714+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('8243e088-0d58-4dce-8195-561024a5df5f', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VSR001-XS-Blanco', '17', 1, '2025-11-22 20:21:05.27616+00', '2025-11-22 20:21:05.27616+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('fe776566-a5f5-4935-ac62-975904c32963', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VSR001-XS-AzulNoche', '6', 1, '2025-11-22 20:21:05.623505+00', '2025-11-22 20:21:05.623505+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('0ac34b4a-5cf2-4b08-9f57-39604a227912', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '13727f44-6d9a-4918-9442-c84aa07358b6', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VSR001-S-Negro', '13', 1, '2025-11-22 20:21:05.935016+00', '2025-11-22 20:21:05.935016+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('59bae671-fe94-4d30-ab0b-2245bcdafafe', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '13727f44-6d9a-4918-9442-c84aa07358b6', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VSR001-S-Blanco', '12', 1, '2025-11-22 20:21:06.247666+00', '2025-11-22 20:21:06.247666+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('87f8a9f6-bfdb-42d1-be55-7202e84b626d', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '13727f44-6d9a-4918-9442-c84aa07358b6', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VSR001-S-AzulNoche', '8', 1, '2025-11-22 20:21:06.561917+00', '2025-11-22 20:21:06.561917+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('942f5e95-2ec6-4c5f-a696-ee6b1e15449f', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '773b670f-f2ae-44ee-8be2-78b0495abdda', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VSR001-M-Negro', '7', 1, '2025-11-22 20:21:06.883143+00', '2025-11-22 20:21:06.883143+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('4a40f3fb-ec86-4515-9eeb-8f7e286870c6', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VSR001-M-Blanco', '5', 1, '2025-11-22 20:21:07.18541+00', '2025-11-22 20:21:07.18541+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('dd75d1c0-c609-4955-812c-7e1b98177968', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VSR001-M-AzulNoche', '6', 1, '2025-11-22 20:21:07.50061+00', '2025-11-22 20:21:07.50061+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('0ebfe96d-a129-4e5d-b2dd-b40230d84506', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VSR001-L-Negro', '17', 1, '2025-11-22 20:21:07.800875+00', '2025-11-22 20:21:07.800875+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('1b53e76b-07cd-4196-9f4f-9f9d99578bf9', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VSR001-L-Blanco', '11', 1, '2025-11-22 20:21:08.122554+00', '2025-11-22 20:21:08.122554+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('f917224c-6edc-4518-8d44-28368eeeefb5', '7f322f6e-c0cb-417b-a9bf-bc829b778ff4', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VSR001-L-AzulNoche', '11', 1, '2025-11-22 20:21:08.460875+00', '2025-11-22 20:21:08.460875+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('69226419-6d75-4125-8db4-f68ac04b7729', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '3d763de0-ba95-4290-aa91-f35e70bed31a', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VTA001-XS-Negro', '10', 1, '2025-11-22 20:21:09.48651+00', '2025-11-22 20:21:09.48651+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('59df78e1-a841-47af-935e-5ba0db845748', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VTA001-XS-Blanco', '6', 1, '2025-11-22 20:21:09.782425+00', '2025-11-22 20:21:09.782425+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('dad3e38e-e9b9-4720-9fc9-f7b46d4724f6', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VTA001-XS-AzulNoche', '7', 1, '2025-11-22 20:21:10.097805+00', '2025-11-22 20:21:10.097805+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('57af6d54-82d8-444d-a57c-6857350eb84d', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '13727f44-6d9a-4918-9442-c84aa07358b6', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VTA001-S-Negro', '15', 1, '2025-11-22 20:21:10.412192+00', '2025-11-22 20:21:10.412192+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('cce369ad-2dc0-4c4b-b9b1-078d50341b77', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '13727f44-6d9a-4918-9442-c84aa07358b6', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VTA001-S-Blanco', '11', 1, '2025-11-22 20:21:10.738639+00', '2025-11-22 20:21:10.738639+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('821e0b06-998d-4a3b-99eb-d0c039517e7f', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '13727f44-6d9a-4918-9442-c84aa07358b6', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VTA001-S-AzulNoche', '14', 1, '2025-11-22 20:21:11.034616+00', '2025-11-22 20:21:11.034616+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('f9b88b33-d5d6-4f51-b6cc-88360bc8863b', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '773b670f-f2ae-44ee-8be2-78b0495abdda', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VTA001-M-Negro', '18', 1, '2025-11-22 20:21:11.348885+00', '2025-11-22 20:21:11.348885+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('ff22ef92-7f87-4fec-a200-ea4335130d53', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VTA001-M-Blanco', '19', 1, '2025-11-22 20:21:11.646479+00', '2025-11-22 20:21:11.646479+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('0c6e4213-8cdc-4b4a-9187-24bf29271e61', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VTA001-M-AzulNoche', '11', 1, '2025-11-22 20:21:11.970404+00', '2025-11-22 20:21:11.970404+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('66b17b05-711e-4bf2-84fe-4b2ce8da3e50', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VTA001-L-Negro', '9', 1, '2025-11-22 20:21:12.266739+00', '2025-11-22 20:21:12.266739+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('dfe02023-860d-46c6-9e09-cebfd2452664', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VTA001-L-Blanco', '15', 1, '2025-11-22 20:21:12.584264+00', '2025-11-22 20:21:12.584264+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('06131d8b-9b20-4232-9ba7-b8ae78edc249', '2eab38a1-277c-473f-8d6e-5e1626df04d2', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VTA001-L-AzulNoche', '19', 1, '2025-11-22 20:21:12.895744+00', '2025-11-22 20:21:12.895744+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('a5b0c696-b6eb-42be-81d8-8fe7bd63710e', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '3d763de0-ba95-4290-aa91-f35e70bed31a', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VBM001-XS-Negro', '17', 1, '2025-11-22 20:21:13.92085+00', '2025-11-22 20:21:13.92085+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('cd3bf6c4-6cc9-49aa-87b3-8e61c6b5605f', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VBM001-XS-Blanco', '12', 1, '2025-11-22 20:21:14.231082+00', '2025-11-22 20:21:14.231082+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('40789752-6d9e-4d08-a69b-865416387450', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VBM001-XS-AzulNoche', '8', 1, '2025-11-22 20:21:14.556978+00', '2025-11-22 20:21:14.556978+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('38765032-cfb0-404b-bc25-192cfefd31b8', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '13727f44-6d9a-4918-9442-c84aa07358b6', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VBM001-S-Negro', '8', 1, '2025-11-22 20:21:14.856862+00', '2025-11-22 20:21:14.856862+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('df77598c-3739-4eef-bf63-fbc0953cd644', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '13727f44-6d9a-4918-9442-c84aa07358b6', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VBM001-S-Blanco', '17', 1, '2025-11-22 20:21:15.179628+00', '2025-11-22 20:21:15.179628+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('90ae185d-4e94-46af-ad71-9af2f726ea1d', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '13727f44-6d9a-4918-9442-c84aa07358b6', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VBM001-S-AzulNoche', '9', 1, '2025-11-22 20:21:15.471865+00', '2025-11-22 20:21:15.471865+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('7c5f17f5-9f8a-4808-a999-ad833173eea8', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '773b670f-f2ae-44ee-8be2-78b0495abdda', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VBM001-M-Negro', '10', 1, '2025-11-22 20:21:15.824001+00', '2025-11-22 20:21:15.824001+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('0b54ec14-8de7-4d22-ad0d-ec6d43ddf144', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VBM001-M-Blanco', '11', 1, '2025-11-22 20:21:16.118272+00', '2025-11-22 20:21:16.118272+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('b54283fb-038a-4187-a223-ce02e9ada42d', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VBM001-M-AzulNoche', '14', 1, '2025-11-22 20:21:16.429753+00', '2025-11-22 20:21:16.429753+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('b59aaa76-0105-4e88-bdd6-2d9a44c51c38', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VBM001-L-Negro', '16', 1, '2025-11-22 20:21:16.725768+00', '2025-11-22 20:21:16.725768+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('f1db23c4-5d07-468d-8115-abd764c8ec32', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VBM001-L-Blanco', '9', 1, '2025-11-22 20:21:17.039479+00', '2025-11-22 20:21:17.039479+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('c453f078-f012-48dc-8223-c03ecf7c2456', 'eab07c01-f03e-4b51-a0ff-d26d80ea5582', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VBM001-L-AzulNoche', '14', 1, '2025-11-22 20:21:17.338008+00', '2025-11-22 20:21:17.338008+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('c98ab739-fae9-4f88-a5f6-488f5fb3058d', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '3d763de0-ba95-4290-aa91-f35e70bed31a', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VJS001-XS-Negro', '7', 1, '2025-11-22 20:21:18.319862+00', '2025-11-22 20:21:18.319862+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('261d97e2-a32e-4586-a203-516cbea60ca9', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VJS001-XS-Blanco', '15', 1, '2025-11-22 20:21:18.650739+00', '2025-11-22 20:21:18.650739+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('b4a0010e-b2c7-4768-9cad-e2105befe45a', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '3d763de0-ba95-4290-aa91-f35e70bed31a', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VJS001-XS-AzulNoche', '12', 1, '2025-11-22 20:21:18.966989+00', '2025-11-22 20:21:18.966989+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('a73b00a6-5f1f-41b9-8e76-7c711a468b59', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '13727f44-6d9a-4918-9442-c84aa07358b6', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VJS001-S-Negro', '14', 1, '2025-11-22 20:21:19.285493+00', '2025-11-22 20:21:19.285493+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('af1bfcf8-5964-4f8d-b166-16b6609988ba', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '13727f44-6d9a-4918-9442-c84aa07358b6', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VJS001-S-Blanco', '6', 1, '2025-11-22 20:21:19.606589+00', '2025-11-22 20:21:19.606589+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('8935201f-d66a-4b44-b6a0-4c8e75e6eafb', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '13727f44-6d9a-4918-9442-c84aa07358b6', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VJS001-S-AzulNoche', '11', 1, '2025-11-22 20:21:19.907245+00', '2025-11-22 20:21:19.907245+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('c718ff7f-8be6-49bd-b60c-fc4634e4b1a5', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '773b670f-f2ae-44ee-8be2-78b0495abdda', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VJS001-M-Negro', '15', 1, '2025-11-22 20:21:20.228507+00', '2025-11-22 20:21:20.228507+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('a7256ea5-0641-43ae-895b-1718f51a7d97', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VJS001-M-Blanco', '6', 1, '2025-11-22 20:21:20.536592+00', '2025-11-22 20:21:20.536592+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('4df437e9-e2bd-4d8c-8d2a-92e38f86e6e6', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '773b670f-f2ae-44ee-8be2-78b0495abdda', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VJS001-M-AzulNoche', '6', 1, '2025-11-22 20:21:20.864137+00', '2025-11-22 20:21:20.864137+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('0b6743ab-1f8b-4348-b891-d52bed12b669', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', '25b12af9-07a3-4bfc-9478-c68bbe6df6b9', 'VJS001-L-Negro', '11', 1, '2025-11-22 20:21:21.160117+00', '2025-11-22 20:21:21.160117+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('7f227898-30f3-4163-8d81-088e20daa4bb', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'b62b28b8-c42b-4509-8657-08d2e4b5fea4', 'VJS001-L-Blanco', '11', 1, '2025-11-22 20:21:21.477892+00', '2025-11-22 20:21:21.477892+00');
INSERT INTO product_variants (id, product_id, size_id, color_id, sku_variant, stock_quantity, is_available, created_at, updated_at) VALUES ('4326bee9-151e-46b7-a41a-0d294416e86f', 'b91fea47-fb40-420e-997e-4d5a89e6f85e', '8bd87e3a-7228-44ac-b50d-3fc5e8abfb26', 'ea5db011-6d82-401b-8cdb-1bca74a98ff8', 'VJS001-L-AzulNoche', '19', 1, '2025-11-22 20:21:21.782066+00', '2025-11-22 20:21:21.782066+00');
