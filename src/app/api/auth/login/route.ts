
import { supabase } from '@/lib/supabase/client'; // This is client-side only usually.

// We need a SERVER SIDE client logic for the route handler.
// Actually, we can just use 'supabase-js' on the server too, but we need to manage cookies manually.

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    const requestUrl = new URL(request.url);
    const formData = await request.json();
    const email = formData.email;
    const password = formData.password;

    // Initialize unique client for this request (server-side)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: false, // We handle session manually via cookies
                autoRefreshToken: false,
            }
        }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Generate response
    const response = NextResponse.json({ success: true });

    // Manually set the auth cookie that middleware looks for
    // Middleware looks for: "sb-[project-ref]-auth-token" usually.
    // BUT my middleware looks for ANY cookie with including "-auth-token"
    // Let's set a simple custom cookie that my middleware allows.

    // Custom cookie for our specific middleware check
    // Security Note: In a massive app we'd use HttpOnly, Secure, SameSite.
    response.cookies.set('sb-admin-auth-token', data.session.access_token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
}
