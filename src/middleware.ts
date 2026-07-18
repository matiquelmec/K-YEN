import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const token = req.cookies.get('kuyen_admin_session')?.value;
    
    let session = null;
    if (token) {
        session = await verifyJWT(token);
    }

    // Protect /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (req.nextUrl.pathname === '/admin/login') {
            if (session) {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            return res;
        }

        // Require session for all other /admin routes
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};
