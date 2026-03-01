'use client';

import { AvatarType, AvatarStyle } from '@/types/wallpaper';
import { useWallpaperStore } from '@/store/wallpaperStore';
import { motion } from 'framer-motion';
import { Check, User } from 'lucide-react';

const avatarTypes: { type: AvatarType; label: string; emoji: string }[] = [
    { type: 'boy', label: 'Boy', emoji: '👦' },
    { type: 'girl', label: 'Girl', emoji: '👧' },
];

const avatarStyles: { style: AvatarStyle; label: string }[] = [
    { style: 'casual', label: 'Casual' },
    { style: 'student', label: 'Student' },
    { style: 'hacker', label: 'Hacker' },
    { style: 'anime', label: 'Anime' },
];

export default function AvatarPicker() {
    const { avatarType, avatarStyle, setAvatarType, setAvatarStyle } = useWallpaperStore();

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-white">Avatar</h3>
            </div>

            {/* Type selector */}
            <div className="flex gap-2 mb-3">
                {avatarTypes.map(({ type, label, emoji }) => {
                    const isActive = avatarType === type;
                    return (
                        <motion.button
                            key={type}
                            onClick={() => setAvatarType(type)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${isActive
                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white'
                                    : 'border-[var(--border)] bg-[var(--surface)]/50 text-[var(--muted)] hover:border-white/20'
                                }`}
                        >
                            <span className="text-lg">{emoji}</span>
                            <span className="text-sm font-medium">{label}</span>
                            {isActive && <Check className="w-3.5 h-3.5 text-[var(--primary)]" />}
                        </motion.button>
                    );
                })}
            </div>

            {/* Style selector */}
            <div className="grid grid-cols-4 gap-1.5">
                {avatarStyles.map(({ style, label }) => {
                    const isActive = avatarStyle === style;
                    return (
                        <motion.button
                            key={style}
                            onClick={() => setAvatarStyle(style)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${isActive
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-white'
                                }`}
                        >
                            {label}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
