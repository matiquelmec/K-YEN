-- Script de Permisos para la Tabla EXISTENTE 'orders'

-- 1. Habilitar RLS (por seguridad, si no lo estaba)
alter table public.orders enable row level security;

-- 2. Permitir a los Administradores (Authenticated) VER todo
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
on public.orders
for select
to authenticated
using (true);

-- 3. Permitir a los Administradores ACTUALIZAR (ej: cambiar estado)
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (true);

-- 4. Asegurar que los clientes (Public/Auth) puedan CREAR órdenes
drop policy if exists "Enable insert for all users" on public.orders;
create policy "Enable insert for all users"
on public.orders
for insert
to public
with check (true);
