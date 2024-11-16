import { Suspense } from 'react';
// lib
import { createServerSupabase } from '@/lib/supabase/supabase-server';
// components
import UploadComponents from '@/components/upload/UploadComponents';

/**
 * 画像アップロードページ
 * @returns JSX.Element
 */
const UploadPage = async () => {
    // サーバー用のSupabaseクライアントの作成
    const supabase = await createServerSupabase();

    if (!supabase?.auth) {
        console.error('Supabase client not properly initialized');
        return <div>Error loading user data</div>;
    }

    // ユーザー情報の取得
    const { data } = await supabase.auth.getUser();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UploadComponents user={data.user} />
        </Suspense>
    );
};

export default UploadPage;
