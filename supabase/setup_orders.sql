-- 1. Crear tabla de Órdenes
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_details jsonb not null, -- Guardaremos nombre, email, telefono, direccion
  shipping_status text default 'pending', -- pending, shipped, delivered
  payment_status text default 'pending', -- pending, paid (en el futuro)
  total_amount numeric not null,
  is_guest boolean default true
);

-- 2. Crear tabla de Items de la Orden
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text not null, -- ID del producto (referencial)
  product_name text not null, -- Guardamos el nombre por si cambia el producto
  quantity integer not null,
  price numeric not null,
  size text,
  color text
);

-- 3. Habilitar Row Level Security (RLS)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 4. Crear políticas de seguridad (CRUCIAL para Guest Checkout)
-- Permitir que CUALQUIERA (incluso anónimos) pueda INSERTAR órdenes
create policy "Enable insert for all users"
on public.orders
for insert
to public
with check (true);

-- Permitir que CUALQUIERA pueda INSERTAR items de órdenes
create policy "Enable insert for all users items"
on public.order_items
for insert
to public
with check (true);

-- Opcional: Permitir ver solo sus propias órdenes (si hay auth)
-- Por ahora, para simpleza, no damos lectura pública para evitar exponer datos.
-- Solo el admin (dashboard de Supabase) podrá ver todas las órdenes.
