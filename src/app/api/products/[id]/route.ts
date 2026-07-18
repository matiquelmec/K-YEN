import { type NextRequest, NextResponse } from 'next/server';
import { dbGetProductById, dbUpdateProduct, dbDeleteProduct } from '@/lib/db/products';
import { verifyJWT } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const product = await dbGetProductById(resolvedParams.id);
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await request.json();
    const updatedProduct = await dbUpdateProduct(resolvedParams.id, body);
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Error in PUT /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    await dbDeleteProduct(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
