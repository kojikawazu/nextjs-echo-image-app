/**
 * フッター
 * @returns JSX.Element
 */
export default function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container flex h-14 items-center justify-between">
                <p className="text-sm text-muted-foreground">Built with Next.js and Tailwind CSS</p>
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Image Storage App
                </p>
            </div>
        </footer>
    );
}
