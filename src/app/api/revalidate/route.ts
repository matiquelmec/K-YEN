import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { invalidateCacheTag, invalidateAllStoreCaches, CACHE_TAGS, CacheTag } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { path, tag, purgeAll } = await request.json().catch(() => ({}));

    if (purgeAll) {
      await invalidateAllStoreCaches();
      return NextResponse.json({
        revalidated: true,
        purgedAll: true,
        message: 'Todos los cachés del servidor e imágenes han sido purgados exitosamente.',
      });
    }

    if (tag) {
      const validTags = Object.values(CACHE_TAGS);
      if (validTags.includes(tag as CacheTag)) {
        await invalidateCacheTag(tag as CacheTag, path ? [path] : ['/', '/catalogo']);
        return NextResponse.json({ revalidated: true, tag, path });
      }
    }

    // Por defecto, purgar todos los caches del e-commerce
    await invalidateAllStoreCaches();

    return NextResponse.json({ revalidated: true, message: 'Cachés del sistema purgados exitosamente' });
  } catch (error: any) {
    console.error('Error in /api/revalidate:', error);
    return NextResponse.json({ error: error.message || 'Error al revalidar' }, { status: 500 });
  }
}
