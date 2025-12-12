-- 1. Crear el bucket de almacenamiento para imágenes de productos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- 2. Políticas de Seguridad (Storage)

-- Permitir acceso PÚBLICO para ver imágenes (LECTURA)
create policy "Public Access to Product Images"
on storage.objects for select
to public
using ( bucket_id = 'product-images' );

-- Permitir subida SOLO a usuarios autenticados (ADMINS)
create policy "Authenticated Users can Upload Images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'product-images' );

-- Permitir actualización SOLO a usuarios autenticados (ADMINS)
create policy "Authenticated Users can Update Images"
on storage.objects for update
to authenticated
using ( bucket_id = 'product-images' );

-- Permitir borrado SOLO a usuarios autenticados (ADMINS)
create policy "Authenticated Users can Delete Images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'product-images' );
