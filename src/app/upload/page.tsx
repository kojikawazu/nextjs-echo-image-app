'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

/**
 * 画像アップロードページ
 * @returns JSX.Element
 */
export default function UploadPage() {
    // 選択されたファイルの状態
    const [files, setFiles] = useState<File[]>([]);
    // アップロード中の状態
    const [uploading, setUploading] = useState(false);
    // アップロードの進捗状態
    const [progress, setProgress] = useState(0);

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
     * ファイルアップロード
     */
    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error('Please select files to upload');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            // Upload logic will be implemented here
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success('Files uploaded successfully');
            setFiles([]);
        } catch (error) {
            toast.error('Failed to upload files');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="container py-8">
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
}
