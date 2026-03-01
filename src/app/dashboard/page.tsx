'use client';

import Link from 'next/link';
import { useScheduleStore } from '@/store/scheduleStore';
import { useUserStore } from '@/store/userStore';
import { getTodayTask } from '@/lib/parser/excelParser';
import StreakBadge from '@/components/gamification/StreakBadge';
import XPBar from '@/components/gamification/XPBar';
import ProgressRing from '@/components/gamification/ProgressRing';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Image, Calendar, BookOpen, Sparkles } from 'lucide-react';

export default function DashboardPage() {
    const { rows } = useScheduleStore();
    const { streak } = useUserStore();
    const todayTask = getTodayTask(rows);
    const hasSchedule = rows.length > 0;

    return (
        <div className="space-y-6">
            {/* Welcome header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
                </h1>
                <p className="text-sm text-[var(--muted)]">
                    {hasSchedule ? "Here's what you're learning today" : 'Upload a schedule to get started'}
                </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-3"
            >
                <StreakBadge />
            </motion.div>

            {/* Today's Task Card */}
            {hasSchedule && todayTask ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-6 border border-[var(--primary)]/20 glow-primary"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-xs font-medium text-[var(--primary)]">TODAY&apos;S TASK</span>
                        </div>
                        {todayTask.difficulty && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${todayTask.difficulty === 'easy' ? 'bg-green-500/15 text-green-400' :
                                    todayTask.difficulty === 'hard' ? 'bg-red-500/15 text-red-400' :
                                        'bg-yellow-500/15 text-yellow-400'
                                }`}>
                                {todayTask.difficulty.charAt(0).toUpperCase() + todayTask.difficulty.slice(1)}
                            </span>
                        )}
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{todayTask.task}</h2>
                    {todayTask.subtask && (
                        <p className="text-sm text-[var(--muted)] mb-4">{todayTask.subtask}</p>
                    )}
                    {todayTask.category && (
                        <span className="text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                            {todayTask.category}
                        </span>
                    )}

                    <div className="mt-6">
                        <Link href="/dashboard/wallpaper">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors animate-pulse-glow"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generate Today&apos;s Wallpaper
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-8 text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-[var(--primary)]" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">No schedule uploaded yet</h2>
                    <p className="text-sm text-[var(--muted)] mb-5 max-w-md mx-auto">
                        Upload your Excel or CSV study plan to get a personalized wallpaper every day
                    </p>
                    <Link href="/dashboard/upload">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Schedule
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </Link>
                </motion.div>
            )}

            {/* Gamification grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <XPBar />
                <ProgressRing />
            </motion.div>

            {/* Quick actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3"
            >
                <Link href="/dashboard/upload">
                    <div className="glass rounded-xl p-4 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                        <BookOpen className="w-5 h-5 text-[var(--accent)] mb-2 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-medium text-white">View Schedule</h4>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                            {hasSchedule ? `${rows.length} tasks loaded` : 'Upload your plan'}
                        </p>
                    </div>
                </Link>
                <Link href="/dashboard/wallpaper">
                    <div className="glass rounded-xl p-4 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                        <Image className="w-5 h-5 text-[var(--primary)] mb-2 group-hover:scale-110 transition-transform" />
                        <h4 className="text-sm font-medium text-white">Wallpaper Studio</h4>
                        <p className="text-xs text-[var(--muted)] mt-0.5">5 themes available</p>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
