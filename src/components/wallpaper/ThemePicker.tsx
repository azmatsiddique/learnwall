'use client';

import { ThemeName } from '@/types/wallpaper';
import { THEMES, getThemePreviewColors } from '@/lib/canvas/themes';
import { useWallpaperStore } from '@/store/wallpaperStore';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';

const themeOrder: ThemeName[] = ['dark', 'neon', 'anime', 'minimal', 'hacker'];

export default function ThemePicker() {
    const { theme, setTheme } = useWallpaperStore();

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-white">Theme</h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {themeOrder.map(name => {
                    const colors = getThemePreviewColors(name);
                    const isActive = theme === name;
                    return (
                        <motion.button
                            key={name}
                            onClick={() => setTheme(name)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isActive
                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                    : 'border-[var(--border)] bg-[var(--surface)]/50 hover:border-white/20'
                                }`}
                        >
                            {/* Color preview */}
                            <div
                                className="w-10 h-10 rounded-lg overflow-hidden relative"
                                style={{ background: colors.bg }}
                            >
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-1/2"
                                    style={{ background: `linear-gradient(transparent, ${colors.accent})`, opacity: 0.5 }}
                                />
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/30"
                                    >
                                        <Check className="w-4 h-4 text-white" />
                                    </motion.div>
                                )}
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-[var(--muted)]'}`}>
                                {THEMES[name].label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
