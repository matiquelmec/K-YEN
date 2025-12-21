import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Sign out from Supabase (this invalidates the session in the DB if persisted)
    await supabase.auth.signOut();

    // FORCE CLEAR any lingering cookies that might confuse middleware
    // specifically the manual one we created before or any other sb- tokens
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie) => {
        if (cookie.name.includes('-auth-token') || cookie.name.startsWith('sb-')) {
            cookieStore.delete(cookie.name);
        }
    });

    return NextResponse.json({ success: true });
}
