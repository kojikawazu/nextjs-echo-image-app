'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// types
import { dummyImages, dummyFolders } from '@/types/dummy-data';
import { FolderData } from '@/types/types';
// lib
import { getFolders, getImages } from '@/lib/s3-client';
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
    // 選択されたアイテムの状態
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    // 現在のフォルダーIDの状態
    const [currentFolderId, setCurrentFolderId] = useState<string | null>('portal');
    // フォルダーデータの状態
    const [folders, setFolders] = useState(dummyFolders);
    // 画像データの状態
    const [images, setImages] = useState(dummyImages);

    // 現在のフォルダーデータ
    const [currentFolder, setCurrentFolder] = useState<FolderData | null>(null);

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
    const handleDelete = () => {
        if (selectedItems.size === 0) {
            toast.error('Please select items to delete');
            return;
        }

        toast.success(`Deleted ${selectedItems.size} items`);
        setSelectedItems(new Set());
    };

    /**
     * フォルダー作成
     * @param name フォルダー名
     */
    const handleCreateFolder = (name: string) => {
        const newFolder: FolderData = {
            id: `folder-${Date.now()}`,
            name,
            createdAt: new Date().toISOString().split('T')[0],
            parentId: currentFolderId,
        };
        setFolders([...folders, newFolder]);
        toast.success(`Created folder: ${name}`);
    };

    // フィルタリングされたフォルダーと画像がないかどうか
    let isEmpty = folders.length === 0 && images.length === 0;

    const handleOpenFolder = async (id: string) => {
        console.log('handleOpenFolder', id);
        setCurrentFolder(folders.find((f) => f.id === id) || null);
        setCurrentFolderId(id);

        try {
            // フォルダー一覧を取得
            const foldersData = await getFolders(id);
            //console.log('Fetched folders:', foldersData);
            setFolders(foldersData);

            // 画像一覧を取得
            const imagesData = await getImages(id);
            //console.log('Fetched images:', imagesData);
            setImages(imagesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('データの取得に失敗しました');
        }
    };

    useEffect(() => {
        const getter = async () => {
            try {
                // フォルダー一覧を取得
                const foldersData = await getFolders(PORTAL_PREFIX);
                //console.log('Fetched folders:', foldersData);
                setFolders(foldersData);

                // 画像一覧を取得
                const imagesData = await getImages(PORTAL_PREFIX);
                //console.log('Fetched images:', imagesData);
                setImages(imagesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('データの取得に失敗しました');
            }
        };
        getter();
    }, []);

    return (
        <div className="container py-8">
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <BreadcrumbNav
                        currentFolder={currentFolder}
                        folders={folders}
                        onNavigate={setCurrentFolderId}
                    />
                    <div className="flex items-center space-x-2">
                        <CreateFolderDialog onCreateFolder={handleCreateFolder} />
                        <Button asChild variant="default" size="sm">
                            <Link href="/upload">
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
