import { Suspense } from 'react';
import MainComponents from '@/components/main/MainComponents';

/**
 * ホームページ
 * @returns JSX.Element
 */
export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MainComponents />
        </Suspense>
    );
}
