'use client';

import { useScheduleStore } from '@/store/scheduleStore';
import { motion } from 'framer-motion';

export default function ProgressRing() {
    const { rows } = useScheduleStore();
    const completedCount = rows.filter(r => r.completed).length;
    const total = rows.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Milestone badges
    const milestones = [25, 50, 75, 100];
    const earnedMilestones = milestones.filter(m => percentage >= m);

    return (
        <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-4">
                {/* Ring */}
                <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.07)"
                            strokeWidth="8"
                        />
                        <motion.circle
                            cx="50" cy="50" r={radius}
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#7C3AED" />
                                <stop offset="100%" stopColor="#00FF9F" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-lg font-bold text-white">{percentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white mb-1">Schedule Progress</h4>
                    <p className="text-xs text-[var(--muted)] mb-2">
                        {completedCount} of {total} tasks completed
                    </p>

                    {/* Milestone badges */}
                    <div className="flex gap-1.5">
                        {milestones.map(m => (
                            <div
                                key={m}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${earnedMilestones.includes(m)
                                        ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                                        : 'bg-white/5 text-[var(--muted)]'
                                    }`}
                            >
                                {m}%
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
