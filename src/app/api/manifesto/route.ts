import { NextResponse } from 'next/server';
import { getManifestoSettings } from '@/lib/db/manifesto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const manifesto = await getManifestoSettings();
    return NextResponse.json(
      { manifesto },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in public /api/manifesto GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del manifiesto', details: error.message },
      { status: 500 }
    );
  }
}
