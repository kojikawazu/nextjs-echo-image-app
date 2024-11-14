'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageData } from '@/types/types';

interface ImageCardProps {
    image: ImageData;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

/**
 * 画像カード
 * @param image 画像データ
 * @param isSelected 選択状態
 * @param onSelect 選択変更時のイベントハンドラ
 * @returns JSX.Element
 */
export default function ImageCard({ image, isSelected, onSelect }: ImageCardProps) {
    // 画像の読み込み状態
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 日付を整形
    const formattedDate = new Date(image.lastModified).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    // ファイルサイズを整形
    const formattedSize = (image.size / 1024).toFixed(1) + ' KB';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
        >
            <div className="absolute right-2 top-2 z-10">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelect(image.id)}
                    className="h-5 w-5 border-2 border-white bg-black/50 data-[state=checked]:bg-primary"
                />
            </div>

            {error ? (
                <div className="flex h-full items-center justify-center text-red-500">
                    画像の読み込みに失敗しました
                </div>
            ) : (
                <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                        isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'
                    }`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setError('画像の読み込みに失敗しました')}
                    priority={false}
                />
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{image.name}</p>
                <p className="text-xs text-white/80">{formattedDate}</p>
                <p className="text-xs text-white/80">{formattedSize}</p>
            </div>
        </motion.div>
    );
}
