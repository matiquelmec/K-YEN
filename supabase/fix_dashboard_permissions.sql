-- Dashboard Permission Fix
-- Asegurar que el Admin pueda LEER (SELECT) todas las tablas necesarias para el dashboard

-- 1. Tabla: PRODUCTS
alter table public.products enable row level security;

-- Permitir Select al Admin (Authenticated)
drop policy if exists "Admins can view all products" on public.products;
create policy "Admins can view all products"
on public.products
for select
to authenticated
using (true);

-- (Opcional) Permitir Select Publico si es el catálogo
drop policy if exists "Enable read access for all users" on public.products;
create policy "Enable read access for all users"
on public.products
for select
to public
using (true);


-- 2. Tabla: ORDERS (Refuerzo)
alter table public.orders enable row level security;

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
on public.orders
for select
to authenticated
using (true);
