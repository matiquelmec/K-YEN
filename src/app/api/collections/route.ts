import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/db/collections';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const collections = await getCollections(false);
    return NextResponse.json(
      { collections },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in public /api/collections GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener colecciones', details: error.message },
      { status: 500 }
    );
  }
}
