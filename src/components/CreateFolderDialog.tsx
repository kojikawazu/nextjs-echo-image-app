'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateFolderDialogProps {
    onCreateFolder: (name: string) => void;
}

/**
 * フォルダー作成ダイアログ
 * @param onCreateFolder フォルダー作成時のイベントハンドラ
 * @returns JSX.Element
 */
export default function CreateFolderDialog({ onCreateFolder }: CreateFolderDialogProps) {
    const [open, setOpen] = useState(false);
    const [folderName, setFolderName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (folderName.trim()) {
            onCreateFolder(folderName.trim());
            setFolderName('');
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Folder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="folderName">Folder Name</Label>
                        <Input
                            id="folderName"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Enter folder name"
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Create Folder
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
