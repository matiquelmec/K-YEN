-- 1. Habilitar RLS para la tabla products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Permitir que cualquier persona vea los productos (Lectura pública)
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access"
ON products FOR SELECT
TO public
USING (true);

-- 3. Permitir que los usuarios autenticados gestionen productos (CRUD completo)
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
CREATE POLICY "Allow authenticated users to manage products"
ON products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Asegurar que el bucket de almacenamiento exista
-- Nota: Esto debe hacerse en el Dashboard de Supabase -> Storage -> New Bucket -> 'product-images' (Público)

-- 5. Políticas de Almacenamiento para 'product-images'
-- Estas políticas permiten a los administradores subir y gestionar fotos.

-- Acceso de lectura para todos
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'product-images' );

-- Inserción/Subida para usuarios autenticados
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-images' );

-- Actualización para usuarios autenticados
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'product-images' );

-- Eliminación para usuarios autenticados
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'product-images' );
