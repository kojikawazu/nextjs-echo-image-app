import { ImageData, FolderData } from '@/types/types';

/**
 * ダミーフォルダデータ
 */
export const dummyFolders: FolderData[] = [
    {
        id: 'folder-1',
        name: 'Landscapes',
        createdAt: '2024-03-20',
        parentId: null,
    },
    {
        id: 'folder-2',
        name: 'Cities',
        createdAt: '2024-03-19',
        parentId: null,
    },
    {
        id: 'folder-3',
        name: 'Mountains',
        createdAt: '2024-03-18',
        parentId: 'folder-1',
    },
];

/**
 * ダミー画像データ
 */
export const dummyImages: ImageData[] = [
    {
        id: 'portal/test01/',
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
        name: 'Mountain Landscape',
        lastModified: '2024-03-20',
        folderId: 'portal',
        size: 1024,
    },
    {
        id: '2',
        url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
        name: 'Ocean Sunset',
        lastModified: '2024-03-19',
        folderId: 'folder-1',
        size: 1024,
    },
    {
        id: '3',
        url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
        name: 'City Lights',
        lastModified: '2024-03-18',
        folderId: 'folder-2',
        size: 1024,
    },
    {
        id: '4',
        url: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
        name: 'Forest Path',
        lastModified: '2024-03-17',
        folderId: null,
        size: 1024,
    },
];
