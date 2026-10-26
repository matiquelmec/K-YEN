import { NextResponse } from 'next/server';
import { getUnboxingSettings } from '@/lib/db/unboxing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const unboxing = await getUnboxingSettings();
    return NextResponse.json(
      { unboxing },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in public /api/unboxing GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de unboxing', details: error.message },
      { status: 500 }
    );
  }
}
