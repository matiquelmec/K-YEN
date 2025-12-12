-- 1. Crear tabla de Órdenes
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_details jsonb not null, -- Guardaremos nombre, email, telefono, direccion
  shipping_status text default 'pending', -- pending, shipped, delivered
  payment_status text default 'pending', -- pending, paid (en el futuro)
  total_amount numeric not null,
  is_guest boolean default true
);

-- 2. Crear tabla de Items de la Orden
create table if not exists public.order_items (
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

-- 4. POLÍTICAS DE ACCESO

-- A. PUBLICO (Clientes/Invitados): Solo pueden INSERTAR (Comprar)
drop policy if exists "Enable insert for all users" on public.orders;
create policy "Enable insert for all users"
on public.orders for insert to public
with check (true);

drop policy if exists "Enable insert for all users items" on public.order_items;
create policy "Enable insert for all users items"
on public.order_items for insert to public
with check (true);

-- B. ADMIN (Autenticados): Pueden VER y ACTUALIZAR todo
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
on public.orders for select to authenticated
using (true);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update to authenticated
using (true);

drop policy if exists "Admins can view order items" on public.order_items;
create policy "Admins can view order items"
on public.order_items for select to authenticated
using (true);
