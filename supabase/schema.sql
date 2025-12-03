-- Create products table
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

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id, size, color)
);

-- Create order status enum
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL DEFAULT concat('ORDER-', gen_random_uuid()),
  status order_status DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for cart_items
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample products
INSERT INTO products (name, description, price, original_price, category, sizes, colors, images, stock, rating, reviews_count, is_new, is_sale, tags)
VALUES
  ('Vestido Luna Nocturna', 'Elegancia misteriosa con detalles de encaje y corte que abraza cada curva', 89990, 109990, 'gotico',
   ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
   ARRAY['Negro', 'Borgoña', 'Azul Medianoche'],
   ARRAY['https://images.unsplash.com/photo-1566479179817-0ddb5fa87cd9'],
   25, 4.8, 127, false, true, ARRAY['elegante', 'nocturno', 'encaje']),

  ('Vestido Flor de Cerezo', 'Frescura natural con estampado floral y silueta que fluye con tu movimiento', 74990, NULL, 'primaveral',
   ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
   ARRAY['Rosa Suave', 'Verde Menta', 'Lavanda'],
   ARRAY['https://images.unsplash.com/photo-1572804013427-4d7ca7268217'],
   30, 4.9, 89, true, false, ARRAY['floral', 'fresco', 'natural']),

  ('Vestido Sol Radiante', 'Libertad solar con tela ligera y corte que celebra tu feminidad', 69990, NULL, 'veraniego',
   ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
   ARRAY['Dorado', 'Coral', 'Turquesa'],
   ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8'],
   20, 4.7, 156, false, false, ARRAY['verano', 'ligero', 'luminoso']),

  ('Vestido Tierra Ancestral', 'Conexión profunda con detalles bordados y silueta que honra tus raíces', 94990, NULL, 'gotico',
   ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
   ARRAY['Tierra', 'Cobre', 'Óxido'],
   ARRAY['https://images.unsplash.com/photo-1594226801341-41427b4e6c22'],
   15, 4.9, 203, false, false, ARRAY['artesanal', 'bordado', 'ancestral']);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);