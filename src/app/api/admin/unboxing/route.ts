import { NextRequest, NextResponse } from 'next/server';
import { getUnboxingSettings, updateUnboxingSettings } from '@/lib/db/unboxing';
import { verifyJWT } from '@/lib/auth';
import type { UnboxingData } from '@/types/unboxing';

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
    const unboxing = await getUnboxingSettings();
    return NextResponse.json({ unboxing });
  } catch (error: any) {
    console.error('Error in /api/admin/unboxing GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de unboxing para admin', details: error.message },
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
    const { badge, title_primary, title_highlight, description, image, image_badge, features } = body;

    // Validaciones de seguridad
    if (title_primary && typeof title_primary !== 'string') {
      return NextResponse.json({ error: 'Título primario inválido' }, { status: 400 });
    }
    if (description && (typeof description !== 'string' || description.length > 800)) {
      return NextResponse.json({ error: 'La descripción no puede superar los 800 caracteres' }, { status: 400 });
    }
    if (features && !Array.isArray(features)) {
      return NextResponse.json({ error: 'Formato de detalles inválido' }, { status: 400 });
    }

    const updateData: Partial<UnboxingData> = {};
    if (badge !== undefined) updateData.badge = String(badge);
    if (title_primary !== undefined) updateData.title_primary = String(title_primary);
    if (title_highlight !== undefined) updateData.title_highlight = String(title_highlight);
    if (description !== undefined) updateData.description = String(description);
    if (image !== undefined) updateData.image = String(image);
    if (image_badge !== undefined) updateData.image_badge = String(image_badge);
    if (features !== undefined) updateData.features = features;

    const updated = await updateUnboxingSettings(updateData);

    return NextResponse.json({
      success: true,
      message: 'Experiencia de empaque actualizada correctamente',
      unboxing: updated,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/unboxing PUT:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar experiencia de empaque' },
      { status: 500 }
    );
  }
}
