import { createClient } from '@supabase/supabase-js';

/**
 * ブラウザ用のSupabaseクライアントを作成
 * @returns Supabaseクライアント
 */
export const createBrowserSupabase = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
};

// ブラウザ用のSupabaseクライアントの作成
export const supabase = createBrowserSupabase();
