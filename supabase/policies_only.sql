-- Solo Políticas de Seguridad (RLS)
-- Como tu tabla ya tiene la estructura correcta, solo aseguramos los "permisos".

-- 1. Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Política para INSERTAR (Para todos: invitados y usuarios)
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;

CREATE POLICY "Enable insert for all users"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Política para LEER (Solo sus propias órdenes)
DROP POLICY IF EXISTS "Enable select for own orders" ON public.orders;

CREATE POLICY "Enable select for own orders"
ON public.orders
FOR SELECT
TO public
USING (auth.uid() = user_id);
