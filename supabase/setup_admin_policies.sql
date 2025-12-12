-- Permitir que los administradores (autenticados) vean todas las órdenes
create policy "Admins can view all orders"
on public.orders
for select
to authenticated
using (true);

-- Permitir que los administradores actualicen órdenes (ej: cambiar estado)
create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (true);

-- Permitir que los administradores vean los items
create policy "Admins can view order items"
on public.order_items
for select
to authenticated
using (true);
