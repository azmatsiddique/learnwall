'use client';

import { Zap } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { getXPForNextLevel } from '@/types/user';
import { motion } from 'framer-motion';

export default function XPBar() {
    const { xp, level } = useUserStore();
    const { current, needed } = getXPForNextLevel(xp);
    const percentage = Math.min((current / needed) * 100, 100);

    return (
        <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-sm font-semibold text-white">Level {level}</span>
                </div>
                <span className="text-xs text-[var(--muted)]">{xp} XP total</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full"
                />
            </div>

            <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-[var(--muted)]">{current} / {needed} XP</span>
                <span className="text-[10px] text-[var(--muted)]">Next: Lv.{level + 1}</span>
            </div>
        </div>
    );
}
