'use client';

import { FolderIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FolderData } from '@/types/types';

interface FolderCardProps {
    folder: FolderData;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onOpen: (id: string) => void;
}

/**
 * フォルダーカード
 * @param folder フォルダーデータ
 * @param isSelected 選択状態
 * @param onSelect 選択変更時のイベントハンドラ
 * @param onOpen 開く時のイベントハンドラ
 * @returns JSX.Element
 */
export default function FolderCard({ folder, isSelected, onSelect, onOpen }: FolderCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-lg border bg-card p-4"
        >
            <div className="absolute right-2 top-2">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelect(folder.id)}
                    className="h-5 w-5"
                />
            </div>
            <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onOpen(folder.id)}
            >
                <FolderIcon className="mr-2 h-4 w-4" />
                <span className="truncate">{folder.name}</span>
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">Created: {folder.createdAt}</p>
        </motion.div>
    );
}
