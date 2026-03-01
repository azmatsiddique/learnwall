'use client';

import { Flame } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';

export default function StreakBadge() {
    const { streak } = useUserStore();

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/20"
        >
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <Flame className="w-5 h-5 text-orange-400" />
            </motion.div>
            <div>
                <span className="text-lg font-bold text-orange-400">{streak}</span>
                <span className="text-xs text-orange-300/70 ml-1">day streak</span>
            </div>
        </motion.div>
    );
}
