import { type NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        const expectedEmail = 'contacto@kuyenchile.cl'; // Standard admin email
        const expectedPassword = process.env.ADMIN_PASSWORD || 'admin_kuyen_2026';

        if (email !== expectedEmail || password !== expectedPassword) {
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
