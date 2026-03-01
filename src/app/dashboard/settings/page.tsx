'use client';

import { useWallpaperStore } from '@/store/wallpaperStore';
import { useUserStore } from '@/store/userStore';
import { useScheduleStore } from '@/store/scheduleStore';
import ThemePicker from '@/components/wallpaper/ThemePicker';
import AvatarPicker from '@/components/wallpaper/AvatarPicker';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Trash2, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
    const { clearSchedule, fileName, rows } = useScheduleStore();
    const wallpaperStore = useWallpaperStore();
    const userStore = useUserStore();

    const handleClearData = () => {
        if (confirm('Are you sure? This will clear your schedule, XP, and streak data.')) {
            clearSchedule();
            localStorage.removeItem('learnwall-user');
            localStorage.removeItem('learnwall-wallpaper');
            localStorage.removeItem('learnwall-schedule');
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
                <p className="text-sm text-[var(--muted)]">Customize your experience</p>
            </motion.div>

            {/* Default preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <SettingsIcon className="w-4 h-4 text-[var(--primary)]" />
                    <h2 className="text-sm font-semibold text-white">Default Preferences</h2>
                </div>
                <div className="space-y-6">
                    <ThemePicker />
                    <AvatarPicker />
                </div>
            </motion.div>

            {/* Data management */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-5"
            >
                <h2 className="text-sm font-semibold text-white mb-4">Data Management</h2>

                <div className="space-y-3">
                    {/* Schedule info */}
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm text-white">Current Schedule</p>
                            <p className="text-xs text-[var(--muted)]">
                                {fileName ? `${fileName} · ${rows.length} tasks` : 'No schedule uploaded'}
                            </p>
                        </div>
                        {fileName && (
                            <button
                                onClick={() => clearSchedule()}
                                className="text-xs text-[var(--danger)] hover:text-red-300 transition-colors flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between py-2 border-t border-white/5">
                        <div>
                            <p className="text-sm text-white">XP & Progress</p>
                            <p className="text-xs text-[var(--muted)]">
                                {userStore.xp} XP · Level {userStore.level} · {userStore.streak} day streak
                            </p>
                        </div>
                    </div>

                    {/* Clear all */}
                    <div className="pt-3 border-t border-white/5">
                        <button
                            onClick={handleClearData}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-sm text-[var(--danger)] hover:bg-[var(--danger)]/20 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset All Data
                        </button>
                        <p className="text-[10px] text-[var(--muted)] mt-1.5">
                            This will clear your schedule, XP, streak, and all preferences
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
