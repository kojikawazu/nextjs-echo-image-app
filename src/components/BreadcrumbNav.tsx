'use client';

import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FolderData } from '@/types/types';

interface BreadcrumbNavProps {
    currentFolder: FolderData | null;
    folders: FolderData[];
    onNavigate: (folderId: string | null) => void;
}

/**
 * パンくずナビゲーション
 * @param currentFolder 現在のフォルダーデータ
 * @param folders フォルダーデータの配列
 * @param onNavigate フォルダー選択時のイベントハンドラ
 * @returns JSX.Element
 */
export default function BreadcrumbNav({ currentFolder, folders, onNavigate }: BreadcrumbNavProps) {
    const getBreadcrumbs = (folder: FolderData | null): FolderData[] => {
        const breadcrumbs: FolderData[] = [];
        let current = folder;

        while (current) {
            breadcrumbs.unshift(current);
            current = folders.find((f) => f.id === current?.parentId) || null;
        }

        return breadcrumbs;
    };
    console.log('currentFolder', currentFolder);

    const breadcrumbs = currentFolder ? getBreadcrumbs(currentFolder) : [];

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-8" onClick={() => onNavigate(null)}>
                <Home className="mr-1 h-4 w-4" />
                Home
            </Button>
            {breadcrumbs.map((folder) => (
                <div key={folder.id} className="flex items-center">
                    <ChevronRight className="h-4 w-4" />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => onNavigate(folder.id)}
                    >
                        {folder.name}
                    </Button>
                </div>
            ))}
        </nav>
    );
}
