import { type NextRequest, NextResponse } from 'next/server';
import { dbGetProducts, dbCreateProduct } from '@/lib/db/products';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const options: { category?: string; search?: string; sortBy?: string; limit?: number } = {};
    if (category) options.category = category;
    if (search) options.search = search;
    if (sortBy) options.sortBy = sortBy;
    if (limit) options.limit = limit;

    const products = await dbGetProducts(options);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const newProduct = await dbCreateProduct(body);
    return NextResponse.json(newProduct);
  } catch (error: any) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
