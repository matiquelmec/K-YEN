import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbGetProductById, dbUpdateProduct, dbDeleteProduct } from '@/lib/db/products';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/catalogo');
      revalidatePath(`/catalogo/${resolvedParams.id}`);
      revalidatePath('/api/products');
    } catch (revalErr) {
      console.warn('Advertencia revalidando rutas tras actualizar producto:', revalErr);
    }

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

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/catalogo');
      revalidatePath('/api/products');
    } catch (revalErr) {
      console.warn('Advertencia revalidando rutas tras eliminar producto:', revalErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
