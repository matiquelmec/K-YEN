import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/db/collections';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const collections = await getCollections(false);
    return NextResponse.json(
      { collections },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
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
