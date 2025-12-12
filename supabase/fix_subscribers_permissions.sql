-- Permisos para tabla Suscriptores

-- 1. Asegurar RLS
alter table public.subscribers enable row level security;

-- 2. Permitir que el Admin vea los correos
drop policy if exists "Admins can view subscribers" on public.subscribers;
create policy "Admins can view subscribers"
on public.subscribers
for select
to authenticated
using (true);

-- 3. Permitir que cualquiera se suscriba (Insertar)
drop policy if exists "Enable insert for all users" on public.subscribers;
create policy "Enable insert for all users"
on public.subscribers
for insert
to public
with check (true);
