-- 1. Modificar la tabla existente para soportar invitados
-- Hacemos que user_id sea opcional (para invitados)
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Agregamos columna para identificar invitados si no existe
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_guest boolean DEFAULT false;

-- 2. Asegurar que las políticas de seguridad (RLS) permitan insertar a TODOS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Borramos políticas antiguas para evitar conflictos y creamos la nueva
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;

CREATE POLICY "Enable insert for all users"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- Política para que los usuarios vean solo sus propias órdenes (si están logueados)
DROP POLICY IF EXISTS "Enable select for own orders" ON public.orders;

CREATE POLICY "Enable select for own orders"
ON public.orders
FOR SELECT
TO public
USING (auth.uid()::text = user_id);
