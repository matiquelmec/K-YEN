import { NextRequest, NextResponse } from 'next/server';
import { getManifestoSettings, updateManifestoSettings } from '@/lib/db/manifesto';
import { verifyJWT } from '@/lib/auth';
import type { ManifestoData } from '@/types/manifesto';

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
    const manifesto = await getManifestoSettings();
    return NextResponse.json({ manifesto });
  } catch (error: any) {
    console.error('Error in /api/admin/manifesto GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener manifiesto para admin', details: error.message },
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
    const {
      badge,
      title_primary,
      title_highlight,
      description,
      pillars,
      card_image,
      card_badge,
      card_subtitle,
      card_title,
      card_description,
      catalog_button_text,
      catalog_button_link,
      whatsapp_number,
      whatsapp_message,
    } = body;

    // Validaciones de seguridad y longitud
    if (title_primary && typeof title_primary !== 'string') {
      return NextResponse.json({ error: 'Título primario inválido' }, { status: 400 });
    }
    if (description && (typeof description !== 'string' || description.length > 800)) {
      return NextResponse.json({ error: 'La descripción no puede superar los 800 caracteres' }, { status: 400 });
    }
    if (pillars && !Array.isArray(pillars)) {
      return NextResponse.json({ error: 'Formato de pilares inválido' }, { status: 400 });
    }

    const updateData: Partial<ManifestoData> = {};
    if (badge !== undefined) updateData.badge = String(badge);
    if (title_primary !== undefined) updateData.title_primary = String(title_primary);
    if (title_highlight !== undefined) updateData.title_highlight = String(title_highlight);
    if (description !== undefined) updateData.description = String(description);
    if (pillars !== undefined) updateData.pillars = pillars;
    if (card_image !== undefined) updateData.card_image = String(card_image);
    if (card_badge !== undefined) updateData.card_badge = String(card_badge);
    if (card_subtitle !== undefined) updateData.card_subtitle = String(card_subtitle);
    if (card_title !== undefined) updateData.card_title = String(card_title);
    if (card_description !== undefined) updateData.card_description = String(card_description);
    if (catalog_button_text !== undefined) updateData.catalog_button_text = String(catalog_button_text);
    if (catalog_button_link !== undefined) updateData.catalog_button_link = String(catalog_button_link);
    if (whatsapp_number !== undefined) updateData.whatsapp_number = String(whatsapp_number);
    if (whatsapp_message !== undefined) updateData.whatsapp_message = String(whatsapp_message);

    const updated = await updateManifestoSettings(updateData);

    return NextResponse.json({
      success: true,
      message: 'Manifiesto y asesoría actualizados correctamente',
      manifesto: updated,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/manifesto PUT:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar manifiesto' },
      { status: 500 }
    );
  }
}
