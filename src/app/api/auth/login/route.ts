import { type NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        // 1. Proteger contra fuerza bruta (max 5 intentos por minuto por IP)
        const rateLimit = checkRateLimit(request, 5, 60 * 1000);
        if (!rateLimit.success) {
            return NextResponse.json(
                { error: 'Demasiados intentos fallidos. Por favor espera un minuto antes de reintentar.' },
                { status: 429 }
            );
        }

        const { email, password } = await request.json();
        
        const expectedEmail = process.env.ADMIN_EMAIL || 'contacto@kuyenchile.cl';
        const expectedPassword = process.env.ADMIN_PASSWORD;

        if (!expectedPassword && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 });
        }

        const validPassword = expectedPassword || 'admin_kuyen_2026';

        if (!email || !password || email.toLowerCase().trim() !== expectedEmail.toLowerCase().trim() || password !== validPassword) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Generate JWT token for 24 hours
        const token = await signJWT({ email, role: 'admin' }, 86400);

        const response = NextResponse.json({ success: true });
        
        // Set secure session cookie
        response.cookies.set({
            name: 'kuyen_admin_session',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 24 hours in seconds
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
