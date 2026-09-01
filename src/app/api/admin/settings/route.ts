import { NextRequest, NextResponse } from 'next/server';
import { getStoreSettings, updateStoreSettings } from '@/lib/db/settings';
import { verifyJWT } from '@/lib/auth';
import type { StoreSettings } from '@/types/settings';

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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidSecureUrl(urlStr: string): boolean {
  if (!urlStr) return true;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error in /api/admin/settings GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración para admin', details: error.message },
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
      contact_email,
      contact_phone,
      contact_whatsapp,
      instagram_url,
      facebook_url,
      tiktok_url,
      pinterest_url,
      address,
      announcement_text,
    } = body;

    // Validaciones de seguridad
    if (contact_email !== undefined) {
      if (!contact_email || !isValidEmail(String(contact_email))) {
        return NextResponse.json({ error: 'El formato de correo electrónico no es válido' }, { status: 400 });
      }
    }

    if (instagram_url && !isValidSecureUrl(String(instagram_url))) {
      return NextResponse.json({ error: 'La URL de Instagram debe ser válida (ej: https://...)' }, { status: 400 });
    }
    if (facebook_url && !isValidSecureUrl(String(facebook_url))) {
      return NextResponse.json({ error: 'La URL de Facebook debe ser válida (ej: https://...)' }, { status: 400 });
    }
    if (tiktok_url && !isValidSecureUrl(String(tiktok_url))) {
      return NextResponse.json({ error: 'La URL de TikTok debe ser válida (ej: https://...)' }, { status: 400 });
    }

    const updateData: Partial<StoreSettings> = {};
    if (contact_email !== undefined) updateData.contact_email = String(contact_email);
    if (contact_phone !== undefined) updateData.contact_phone = String(contact_phone);
    if (contact_whatsapp !== undefined) updateData.contact_whatsapp = String(contact_whatsapp);
    if (instagram_url !== undefined) updateData.instagram_url = String(instagram_url);
    if (facebook_url !== undefined) updateData.facebook_url = String(facebook_url);
    if (tiktok_url !== undefined) updateData.tiktok_url = String(tiktok_url);
    if (pinterest_url !== undefined) updateData.pinterest_url = String(pinterest_url);
    if (address !== undefined) updateData.address = String(address);
    if (announcement_text !== undefined) updateData.announcement_text = String(announcement_text);

    const updated = await updateStoreSettings(updateData);

    return NextResponse.json({
      success: true,
      message: 'Ajustes de contacto y redes sociales actualizados correctamente',
      settings: updated,
    });
  } catch (error: any) {
    console.error('Error in /api/admin/settings PUT:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar configuración de tienda' },
      { status: 500 }
    );
  }
}
