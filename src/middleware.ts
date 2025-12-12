import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Protect /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        // 1. Get all cookies
        const allCookies = req.cookies.getAll();

        // 2. Check for Supabase Auth token
        // It usually starts with 'sb-' and ends with '-auth-token'
        // or just check if ANY supabase related cookie exists.
        const hasAuthCookie = allCookies.some(cookie =>
            cookie.name.includes('-auth-token')
        );

        // Allow access to login page
        if (req.nextUrl.pathname === '/admin/login') {
            // If likely logged in, redirect to dashboard
            if (hasAuthCookie) {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            return res;
        }

        // Require session for all other /admin routes
        if (!hasAuthCookie) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    return res;
}

export const config = {
    matcher: ['/admin/:path*'],
};
