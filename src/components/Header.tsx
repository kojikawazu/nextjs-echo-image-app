'use client';

import { ImageIcon, UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

/**
 * ヘッダー
 * @returns JSX.Element
 */
export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <ImageIcon className="h-6 w-6" />
                    <span className="font-bold">Image Storage</span>
                </Link>

                <nav className="flex items-center space-x-4">
                    <Button variant={pathname === '/' ? 'default' : 'ghost'} size="sm" asChild>
                        <Link href="/">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Gallery
                        </Link>
                    </Button>
                    <Button
                        variant={pathname === '/upload' ? 'default' : 'ghost'}
                        size="sm"
                        asChild
                    >
                        <Link href="/upload">
                            <UploadIcon className="mr-2 h-4 w-4" />
                            Upload
                        </Link>
                    </Button>
                    <ModeToggle />
                </nav>
            </div>
        </header>
    );
}
