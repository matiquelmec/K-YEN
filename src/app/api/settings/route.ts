import { NextResponse } from 'next/server';
import { getStoreSettings } from '@/lib/db/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(
      { settings },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
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
