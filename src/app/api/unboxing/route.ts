import { NextResponse } from 'next/server';
import { getUnboxingSettings } from '@/lib/db/unboxing';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const unboxing = await getUnboxingSettings();
    return NextResponse.json(
      { unboxing },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
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
