import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// components
import { ThemeProvider } from '@/components/theme-provider';
import SupabaseProvider from '@/components/supabase/supabase-provider';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// styles
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Image Box App',
    description: 'Image Box App',
};

/**
 * ルートレイアウト
 * @param children 子要素
 * @returns JSX.Element
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <body className={inter.className}>
                <SupabaseProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex min-h-screen flex-col">
                            <Header />
                            <main className="flex-grow">{children}</main>
                            <Footer />
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </SupabaseProvider>
            </body>
        </html>
    );
}
