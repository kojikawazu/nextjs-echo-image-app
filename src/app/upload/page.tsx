import { Suspense } from 'react';
import UploadComponents from '@/components/upload/UploadComponents';

/**
 * 画像アップロードページ
 * @returns JSX.Element
 */
export default function UploadPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UploadComponents />
        </Suspense>
    );
}
