import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { path, tag } = await request.json().catch(() => ({}));

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    }

    if (tag) {
      (revalidateTag as any)(tag);
      return NextResponse.json({ revalidated: true, tag });
    }

    // Por defecto, revalidar las rutas críticas del e-commerce
    revalidatePath('/', 'page');
    revalidatePath('/catalogo', 'page');
    revalidatePath('/catalogo/[id]', 'page');

    return NextResponse.json({ revalidated: true, message: 'Rutas de catálogo revalidadas con éxito' });
  } catch (error: any) {
    console.error('Error in /api/revalidate:', error);
    return NextResponse.json({ error: error.message || 'Error al revalidar' }, { status: 500 });
  }
}
