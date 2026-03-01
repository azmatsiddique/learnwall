'use client';

import { Flame, Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Upload, Image, LayoutDashboard, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
    { href: '/dashboard/wallpaper', icon: Image, label: 'Wallpaper' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function TopBar() {
    const { xp, level, streak } = useUserStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <header className="sticky top-0 z-40 glass-strong">
                <div className="flex items-center justify-between px-4 md:px-8 h-16">
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Mobile logo */}
                    <Link href="/" className="md:hidden flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#00FF9F] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm">LearnWall</span>
                    </Link>

                    {/* Desktop spacer */}
                    <div className="hidden md:block" />

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-semibold text-orange-400">{streak}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                            <Zap className="w-4 h-4 text-[var(--accent)]" />
                            <span className="text-sm font-semibold text-[var(--accent)]">{xp} XP</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5">
                            <span className="text-xs text-[var(--muted)]">Lv.</span>
                            <span className="text-sm font-bold text-white">{level}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile nav drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.nav
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 h-full w-[260px] glass-strong z-50 md:hidden p-4 pt-20"
                        >
                            <div className="space-y-1">
                                {navItems.map(item => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                                            <div
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                        ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                                                        : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
