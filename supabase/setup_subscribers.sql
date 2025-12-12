-- 1. Crear tabla de Suscriptores
create table if not exists public.subscribers (
  email text primary key, -- Usamos el email como clave para evitar duplicados fácilmente
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar seguridad (RLS)
alter table public.subscribers enable row level security;

-- 3. Políticas de seguridad
-- Permitir que CUALQUIERA (invitados) pueda insertar su email
drop policy if exists "Enable insert for all users" on public.subscribers;
create policy "Enable insert for all users"
on public.subscribers
for insert
to public
with check (true);

-- Solo el admin (dashboard) puede ver los emails (nadie desde la web pública)
-- No creamos policy de SELECT pública explicita (por defecto deniega todo salvo lo permitido)
