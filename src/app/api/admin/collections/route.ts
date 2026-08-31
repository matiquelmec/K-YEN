import { NextRequest, NextResponse } from 'next/server';
import { getCollections, updateCollection, type CollectionItem } from '@/lib/db/collections';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  const token =
    request.cookies.get('kuyen_admin_session')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) return false;
  const session = await verifyJWT(token);
  return !!session;
}

export async function GET(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const collections = await getCollections(true);
    return NextResponse.json({ collections });
  } catch (error: any) {
    console.error('Error in /api/admin/collections GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener colecciones para admin', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, subtitle, tag, description, image, number, category_id, is_active } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'El identificador (id) de la colección es obligatorio' },
        { status: 400 }
      );
    }

    if (title && (typeof title !== 'string' || title.trim().length > 100)) {
      return NextResponse.json(
        { error: 'El título debe ser un texto de máximo 100 caracteres' },
        { status: 400 }
      );
    }

    if (description && (typeof description !== 'string' || description.trim().length > 500)) {
      return NextResponse.json(
        { error: 'La descripción debe tener un máximo de 500 caracteres' },
        { status: 400 }
      );
    }

    if (image && typeof image !== 'string') {
      return NextResponse.json(
        { error: 'La URL de la imagen es inválida' },
        { status: 400 }
      );
    }

    const updateData: Partial<Omit<CollectionItem, 'id'>> = {};
    if (title !== undefined) updateData.title = String(title);
    if (subtitle !== undefined) updateData.subtitle = String(subtitle);
    if (tag !== undefined) updateData.tag = String(tag);
    if (description !== undefined) updateData.description = String(description);
    if (image !== undefined) updateData.image = String(image);
    if (number !== undefined) updateData.number = String(number);
    if (category_id !== undefined) updateData.category_id = String(category_id);
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);

    const updated = await updateCollection(id, updateData);

    if (!updated) {
      return NextResponse.json(
        { error: 'No se encontró la colección para actualizar' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Colección actualizada correctamente',
      collection: updated,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/collections PUT:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar colección' },
      { status: 500 }
    );
  }
}
