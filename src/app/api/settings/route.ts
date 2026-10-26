import { NextResponse } from 'next/server';
import { getStoreSettings } from '@/lib/db/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(
      { settings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in public /api/settings GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración de tienda', details: error.message },
      { status: 500 }
    );
  }
}
