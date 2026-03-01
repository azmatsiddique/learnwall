import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Sidebar />
            <div className="md:ml-[260px]">
                <TopBar />
                <main className="p-4 md:p-8 max-w-5xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
