-- CORRECCIÓN DEFINITIVA (V3)
-- Basado en el error "operator does not exist: text = uuid", sabemos que user_id es UUID.

-- 1. Hacer user_id opcional (si no lo es ya)
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- 2. Asegurar columna is_guest
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_guest boolean DEFAULT false;

-- 3. Limpiar políticas antiguas (por si acaso)
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable select for own orders" ON public.orders;

-- 4. Crear política de inserción PÚBLICA (para invitados y usuarios)
CREATE POLICY "Enable insert for all users"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- 5. Crear política de lectura personal (CORREGIDA: UUID vs UUID)
-- Al quitar el ::text, comparamos uuid con uuid.
CREATE POLICY "Enable select for own orders"
ON public.orders
FOR SELECT
TO public
USING (auth.uid() = user_id);
