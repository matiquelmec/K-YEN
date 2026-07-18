import { type NextRequest, NextResponse } from 'next/server';
import { dbGetSubscribers, dbCreateSubscriber } from '@/lib/db/orders';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const token = request.cookies.get('kuyen_admin_session')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const subscribers = await dbGetSubscribers();
    return NextResponse.json(subscribers);
  } catch (error: any) {
    console.error('Error in GET /api/subscribers:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const subscriber = await dbCreateSubscriber(email);
    return NextResponse.json(subscriber);
  } catch (error: any) {
    // SQLite UNIQUE constraint failure
    if (error.message && (error.message.includes('UNIQUE') || error.message.includes('constraint failed'))) {
      return NextResponse.json({ success: true, message: 'Ya suscrito' });
    }
    console.error('Error in POST /api/subscribers:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
