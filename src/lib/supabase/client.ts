import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { APP_CONFIG } from '../config';

export const supabase = createBrowserClient(
    APP_CONFIG.supabase.url,
    APP_CONFIG.supabase.anonKey
);