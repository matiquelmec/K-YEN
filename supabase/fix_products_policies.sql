-- Habilitar RLS en la tabla products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para que CUALQUIERA pueda ver los productos (Catálogo público)
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products"
ON products FOR SELECT
TO public
USING (true);

-- Política para que SOLO ADMINS (autenticados) puedan insertar, actualizar o borrar
-- Nota: En un sistema real, deberías chequear el rol del usuario (ej: auth.jwt() -> role = 'admin')
-- Por ahora, asumimos que cualquier usuario autenticado es "staff" o similar.

DROP POLICY IF EXISTS "Admin All Products" ON products;
CREATE POLICY "Admin All Products"
ON products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
