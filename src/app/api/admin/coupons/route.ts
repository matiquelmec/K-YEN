import { NextRequest, NextResponse } from 'next/server';
import { dbGetCoupons, dbCreateCoupon, dbUpdateCoupon, dbDeleteCoupon } from '@/lib/db/coupons';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('kuyen_admin_session')?.value;
  if (!token) return false;
  const session = await verifyJWT(token);
  return !!session;
}

export async function GET(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const coupons = await dbGetCoupons();
    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Error al obtener cupones', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, discount_type, discount_value, min_cart_amount, usage_limit, expires_at, is_active, affiliate_name } = body;

    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json({ error: 'Faltan datos obligatorios del cupón' }, { status: 400 });
    }

    await dbCreateCoupon({
      code,
      discount_type,
      discount_value: Number(discount_value),
      min_cart_amount: Number(min_cart_amount || 0),
      usage_limit: usage_limit ? Number(usage_limit) : null,
      expires_at: expires_at || null,
      is_active: is_active !== false,
      affiliate_name: affiliate_name || null
    });

    return NextResponse.json({ success: true, message: 'Cupón creado correctamente' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: error.message || 'Error al crear cupón' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, discount_type, discount_value, min_cart_amount, usage_limit, expires_at, is_active, affiliate_name } = body;

    if (!code) {
      return NextResponse.json({ error: 'Código de cupón requerido' }, { status: 400 });
    }

    await dbUpdateCoupon(code, {
      discount_type,
      discount_value: Number(discount_value),
      min_cart_amount: Number(min_cart_amount || 0),
      usage_limit: usage_limit ? Number(usage_limit) : null,
      expires_at: expires_at || null,
      is_active: is_active !== false,
      affiliate_name: affiliate_name || null
    });

    return NextResponse.json({ success: true, message: 'Cupón actualizado correctamente' });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: error.message || 'Error al actualizar cupón' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Código de cupón requerido' }, { status: 400 });
    }

    await dbDeleteCoupon(code);
    return NextResponse.json({ success: true, message: 'Cupón eliminado correctamente' });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: error.message || 'Error al eliminar cupón' }, { status: 400 });
  }
}
