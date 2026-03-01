'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Upload, Image, LayoutDashboard, Settings, Sparkles, Smartphone, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useUserStore } from '@/store/userStore';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
    { href: '/dashboard/wallpaper', icon: Image, label: 'Wallpaper' },
    { href: '/dashboard/auto-setup', icon: Smartphone, label: 'Auto Setup' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="hidden md:flex flex-col w-[260px] h-screen fixed left-0 top-0 glass-strong z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#00FF9F] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">LearnWall</h1>
                        <p className="text-[10px] text-[var(--muted)] tracking-wider uppercase">Daily Wallpaper</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(item => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/20'
                                    : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 space-y-3">


                <button
                    onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        // Reset local uid so data doesn't leak to next session
                        useUserStore.getState().setUid('default');
                        router.push('/login');
                        router.refresh();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Log Out</span>
                </button>
            </div>
        </aside>
    );
}
