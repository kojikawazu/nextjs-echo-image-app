'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Upload, X, LogIn, LogOut } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
// types
import { FolderData } from '@/types/types';
// lib
import { getFolder } from '@/lib/s3/s3-fetch';
import { addImages } from '@/lib/s3/s3-client';
import { COMMON_CONSTANTS } from '@/lib/constants';
import { signOut } from '@/lib/supabase/supabase-server';
// components
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSupabase } from '@/components/supabase/supabase-provider';
import BreadcrumbNav from '@/components/BreadcrumbNav';

interface UploadComponentsProps {
    user: User | null;
}

/**
 * 画像アップロードコンポーネント
 * @param user ユーザー情報
 * @returns JSX.Element
 */
const UploadComponents = ({ user }: UploadComponentsProps) => {
    // URLから現在のフォルダー情報を取得して設定
    const searchParams = useSearchParams();
    // ルーター
    const router = useRouter();
    // 現在のフォルダー情報
    const [currentFolder, setCurrentFolder] = useState<FolderData | null>(null);
    // 選択されたファイルの状態
    const [files, setFiles] = useState<File[]>([]);
    // アップロード中の状態
    const [uploading, setUploading] = useState(false);
    // アップロードの進捗状態
    const [progress, setProgress] = useState(0);
    // Supabase(カスタム用)
    const { syncSession } = useSupabase();

    /**
     * ドロップされたファイルの処理
     * @param acceptedFiles 受け入れられたファイルの配列
     */
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    // ドロップゾーンのプロパティと状態
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        },
    });

    /**
     * ファイル削除
     * @param name ファイル名
     */
    const removeFile = (name: string) => {
        setFiles((prev) => prev.filter((file) => file.name !== name));
    };

    /**
     * フォルダーを開く
     * @param id フォルダーID
     */
    const handleOpenFolder = async (id: string) => {
        try {
            // 語尾に/がある場合は削除
            const folderId = id.endsWith('/') ? id.slice(0, -1) : id || 'portal/';
            router.push(`/?folderId=${folderId}`);
        } catch (error) {
            console.error('Error fetching folder:', error);
            toast.error('フォルダーの取得に失敗しました');
        }
    };

    /**
     * ファイルアップロード
     */
    const handleUpload = async () => {
        // ファイルが選択されていない場合はエラー
        if (files.length === 0) {
            toast.error('Please select files to upload');
            return;
        }

        // アップロード中の状態に設定
        setUploading(true);
        setProgress(0);

        try {
            // 画像をアップロード
            const currentFolderId = currentFolder?.id || '';
            await addImages(currentFolderId, files);
            // アップロード完了
            toast.success('Files uploaded successfully');
            // 選択されたファイルをクリア
            setFiles([]);
        } catch (error) {
            console.error('error: ', error);
            toast.error('Failed to upload files');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    /**
     * サインアウト
     */
    const handleSignOut = async () => {
        try {
            await signOut();
            await syncSession();
            toast.success('SignOut Successed');
            // リダイレクトは不要
        } catch (error) {
            toast.error('SignOut Failed');
            console.error(error);
        }
    };

    // URLから現在のフォルダー情報を取得して設定
    useEffect(() => {
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
            }
        };
        getCurrentFolder();
    }, [searchParams]);

    return (
        <div className="container py-8">
            <div className="mb-6 space-y-4">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-lg font-semibold mb-4">{user ? user.email : 'Guest'}</h2>
                    {user ? (
                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            SignOut
                        </Button>
                    ) : (
                        <Link href={COMMON_CONSTANTS.URL.PAGE_LOGIN_FORM}>
                            <Button variant="outline" size="sm">
                                <LogIn className="mr-2 h-4 w-4" />
                                SignIn
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="mb-6 space-y-4">
                <BreadcrumbNav currentFolder={currentFolder} onNavigate={handleOpenFolder} />
            </div>

            <div
                {...getRootProps()}
                className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                    Drag & drop images here, or click to select files
                </p>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-8"
                    >
                        <div className="rounded-lg border bg-card">
                            <div className="p-4">
                                <h3 className="font-semibold">Selected Files</h3>
                            </div>
                            <div className="divide-y">
                                {files.map((file) => (
                                    <div
                                        key={file.name}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <span className="text-sm">{file.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFile(file.name)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {uploading && <Progress value={progress} className="mt-4" />}

                        <Button className="mt-4" onClick={handleUpload} disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Upload Files'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadComponents;
