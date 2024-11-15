'use client';

import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FolderData } from '@/types/types';
import { COMMON_CONSTANTS } from '@/lib/constants';

interface BreadcrumbNavProps {
    currentFolder: FolderData | null;
    onNavigate: (id: string) => void;
}

/**
 * パスから階層構造を作成
 * @param path S3のパス（例: 'portal/test02/children02/'）
 * @returns 階層構造の配列（例: ['portal/', 'portal/test02/', 'portal/test02/children02/']）
 */
const createPathHierarchy = (path: string): string[] => {
    // 末尾のスラッシュを削除
    const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
    // パスを分割
    const parts = cleanPath.split('/');

    // 階層構造を作成
    return parts
        .map((_, index) => {
            const pathPart = parts.slice(0, index + 1).join('/') + '/';
            return pathPart;
        })
        .filter((path) => path !== 'portal/');
};

/**
 * パスからフォルダー名を取得
 * @param path S3のパス（例: 'portal/test02/children02/'）
 * @returns フォルダー名の配列（例: ['test02', 'children02']）
 */
const getFolderNames = (path: string): string[] => {
    // 既存の階層構造を利用
    const hierarchy = createPathHierarchy(path);

    // 各パスから最後のフォルダー名を抽出
    return hierarchy.map(
        (path) =>
            path
                .slice(0, -1) // 末尾のスラッシュを削除
                .split('/') // パスを分割
                .pop() || '', // 最後の要素を取得
    );
};

/**
 * パンくずナビゲーション
 * @param currentFolder 現在のフォルダーデータ
 * @param onNavigate フォルダー選択時のイベントハンドラ
 * @returns JSX.Element
 */
export default function BreadcrumbNav({ currentFolder, onNavigate }: BreadcrumbNavProps) {
    // パスから階層構造を作成
    const pathHierarchy = createPathHierarchy(currentFolder?.id || '');
    // パスからフォルダー名を取得
    const folderNames = getFolderNames(currentFolder?.id || '');
    // ルートパス
    const rootPath = COMMON_CONSTANTS.PATH.ROOT;

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-8" onClick={() => onNavigate(rootPath)}>
                <Home className="mr-1 h-4 w-4" />
                Home
            </Button>
            {pathHierarchy.map((path, key) => {
                // パスが正しい形式かチェック
                const validPath = path.startsWith(rootPath) ? path : `${rootPath}${path}`;

                return (
                    <div key={key} className="flex items-center">
                        <ChevronRight className="h-4 w-4" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => onNavigate(validPath)}
                        >
                            {folderNames[key]}
                        </Button>
                    </div>
                );
            })}
        </nav>
    );
}
