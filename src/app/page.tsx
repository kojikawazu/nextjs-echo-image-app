'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ImagePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// types
import { dummyImages, dummyFolders } from '@/types/dummy-data';
import { FolderData } from '@/types/types';
// lib
import { addFolder, deleteFolders, deleteImages } from '@/lib/s3/s3-client';
import { getFolder, getChildrenFolders, getImages } from '@/lib/s3/s3-fetch';
import { PORTAL_PREFIX } from '@/lib/constants';
// components
import { Button } from '@/components/ui/button';
import ImageCard from '@/components/ImageCard';
import FolderCard from '@/components/FolderCard';
import CreateFolderDialog from '@/components/CreateFolderDialog';
import BreadcrumbNav from '@/components/BreadcrumbNav';

/**
 * ホームページ
 * @returns JSX.Element
 */
export default function Home() {
    // URLから現在のフォルダー情報を取得して設定
    const searchParams = useSearchParams();
    // 選択されたアイテムの状態
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    // 現在のフォルダーIDの状態
    const [currentFolderId] = useState<string | null>('portal');
    // フォルダーデータの状態
    const [folders, setFolders] = useState(dummyFolders);
    // 画像データの状態
    const [images, setImages] = useState(dummyImages);

    // 現在のフォルダーデータ
    const [currentFolder, setCurrentFolder] = useState<FolderData | null>(null);
    // 前の階層のフォルダー情報を保持するstate
    const [previousFolders, setPreviousFolders] = useState<FolderData[]>([]);

    /**
     * アイテム選択の切り替え
     * @param id アイテムID
     */
    const toggleItemSelection = (id: string) => {
        setSelectedItems((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(id)) {
                newSelection.delete(id);
            } else {
                newSelection.add(id);
            }
            return newSelection;
        });
    };

    /**
     * アイテム削除
     */
    const handleDelete = async () => {
        // 選択されたアイテムがない場合はエラー
        if (selectedItems.size === 0) {
            toast.error('Please select items to delete');
            return;
        }

        // 選択されたアイテムをフォルダと画像に分ける
        const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const folderIds = Array.from(selectedItems).filter(item => !ALLOWED_IMAGE_EXTENSIONS.some(ext => item.toLowerCase().endsWith(ext)));
        const imageKeys = Array.from(selectedItems).filter(item => ALLOWED_IMAGE_EXTENSIONS.some(ext => item.toLowerCase().endsWith(ext)));

        // フォルダーが選択されている場合
        if (folderIds.length > 0) {
            try {
                // 選択されたアイテムを削除
                await deleteFolders(folderIds);
                // 選択されたアイテムをフォルダーリストから削除
                setFolders(folders.filter((folder) => !selectedItems.has(folder.id)));
            } catch (error) {
                console.error('Error deleting folders:', error);
                toast.error('Failed to delete folders');
            }
        }

        // 画像が選択されている場合 
        if (imageKeys.length > 0) {
            try {
                // 選択されたアイテムを削除
                await deleteImages(imageKeys);
                // 選択されたアイテムを画像リストから削除
                setImages(images.filter((image) => !selectedItems.has(image.id)));
            } catch (error) {
                console.error('Error deleting images:', error);
                toast.error('Failed to delete images');
            }
        }

        setSelectedItems(new Set());
        toast.success(`Deleted ${selectedItems.size} items`);
    };

    /**
     * フォルダー作成
     * @param name フォルダー名
     */
    const handleCreateFolder = async (name: string) => {
        const newFolder: FolderData = {
            id: `folder-${Date.now()}`,
            name,
            createdAt: new Date().toISOString().split('T')[0],
            parentId: currentFolderId,
        };

        try {
            // フォルダーを作成
            const createdFolders = await addFolder(newFolder);
            // フォルダー一覧に追加
            setFolders([...folders, createdFolders]);
            // フォルダー作成成功メッセージ
            toast.success(`Created folder: ${name}`);
        } catch (error) {
            console.error('Error creating folder:', error);
            toast.error('Failed to create folder');
        }
    };

    // フィルタリングされたフォルダーと画像がないかどうか
    const isEmpty = folders.length === 0 && images.length === 0;

    /**
     * フォルダーを開く
     * @param id フォルダーID
     */
    const handleOpenFolder = async (id: string) => {
        if (!currentFolder) {
            // 初期状態からの移動
            setCurrentFolder(folders.find((f) => f.id === id) || null);
            setPreviousFolders(folders);
        } else {
            const currentParts = currentFolder.id.split('/');
            const newParts = id.split('/');

            if (newParts.length < currentParts.length) {
                // 親フォルダーへの移動
                const parentFolder: FolderData = {
                    id: id,
                    name: id.split('/').slice(-2, -1)[0] || 'portal',
                    createdAt: new Date().toISOString(),
                    parentId: id.split('/').slice(0, -2).join('/') + '/',
                };
                setCurrentFolder(parentFolder);
            } else if (newParts.length === currentParts.length) {
                // 同一階層での移動
                setCurrentFolder(previousFolders.find((f) => f.id === id) || null);
            } else {
                // 子フォルダーへの移動
                setCurrentFolder(folders.find((f) => f.id === id) || null);
                setPreviousFolders(folders);
            }
        }

        try {
            // フォルダー一覧を取得
            const foldersData = await getChildrenFolders(id);
            setFolders(foldersData);

            // 画像一覧を取得
            const imagesData = await getImages(id);
            setImages(imagesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('データの取得に失敗しました');
        }
    };

    // URLから現在のフォルダー情報を取得して設定
    useEffect(() => {
        /**
         * 現在のフォルダー情報を取得
         */
        const getCurrentFolder = async () => {
            const folderId = searchParams.get('folderId');

            if (folderId) {
                const folder = await getFolder(folderId);
                setCurrentFolder({
                    id: folderId,
                    name: folder.name,
                    createdAt: new Date().toISOString(),
                    parentId: folder.parentId || 'portal/',
                });

                return folder;
            }

            return null;
        };

        /**
         * フォルダー一覧と画像一覧を取得
         */
        const getData = async (currentFolder: FolderData | null) => {
            try {
                // フォルダーIDが指定されている場合はそのフォルダーの内容を取得
                const targetPath = currentFolder?.id || PORTAL_PREFIX;

                // フォルダー一覧を取得
                const foldersData = await getChildrenFolders(targetPath);
                setFolders(foldersData);

                // 画像一覧を取得
                const imagesData = await getImages(targetPath);
                setImages(imagesData);

                // 親フォルダーの情報を保持（パンくずリスト用）
                if (currentFolder?.parentId) {
                    const parentFolders = await getFolder(currentFolder.parentId);
                    setPreviousFolders([parentFolders]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('データの取得に失敗しました');
            }
        };

        const init = async () => {
            const currentFolder = await getCurrentFolder();
            await getData(currentFolder);
        };

        init();
    }, [searchParams]);

    return (
        <div className="container py-8">
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <BreadcrumbNav currentFolder={currentFolder} onNavigate={handleOpenFolder} />
                    <div className="flex items-center space-x-2">
                        <CreateFolderDialog onCreateFolder={handleCreateFolder} />
                        <Button asChild variant="default" size="sm">
                            <Link href={`/upload?folderId=${currentFolder?.id || 'portal/'}`}>
                                <ImagePlus className="mr-2 h-4 w-4" />
                                Upload Images
                            </Link>
                        </Button>
                        {selectedItems.size > 0 && (
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete ({selectedItems.size})
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {isEmpty ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border-2 border-dashed">
                    <ImagePlus className="h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">This folder is empty</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Upload images or create folders to get started
                    </p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    {folders.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Folders</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {folders.map((folder: FolderData) => (
                                    <FolderCard
                                        key={folder.id}
                                        folder={folder}
                                        isSelected={selectedItems.has(folder.id)}
                                        onSelect={toggleItemSelection}
                                        onOpen={() => handleOpenFolder(folder.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {images.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Images</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {images.map((image) => (
                                    <ImageCard
                                        key={image.id}
                                        image={image}
                                        isSelected={selectedItems.has(image.id)}
                                        onSelect={toggleItemSelection}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
