'use client';

import ThemePicker from '@/components/wallpaper/ThemePicker';
import AvatarPicker from '@/components/wallpaper/AvatarPicker';
import WallpaperPreview from '@/components/wallpaper/WallpaperPreview';
import { motion } from 'framer-motion';

export default function WallpaperPage() {
    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Wallpaper Studio</h1>
                <p className="text-sm text-[var(--muted)]">
                    Customize your theme and avatar, then generate your daily wallpaper
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Controls */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="glass rounded-2xl p-5">
                        <ThemePicker />
                    </div>
                    <div className="glass rounded-2xl p-5">
                        <AvatarPicker />
                    </div>
                </motion.div>

                {/* Right: Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                >
                    <WallpaperPreview />
                </motion.div>
            </div>
        </div>
    );
}
