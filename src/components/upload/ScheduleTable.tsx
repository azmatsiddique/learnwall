'use client';

import { useState } from 'react';
import { useScheduleStore } from '@/store/scheduleStore';
import { isToday } from '@/lib/parser/dateResolver';
import { ChevronLeft, ChevronRight, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ROWS_PER_PAGE = 8;

const difficultyColors: Record<string, string> = {
    easy: 'bg-green-500/15 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    hard: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function ScheduleTable() {
    const { rows } = useScheduleStore();
    const [page, setPage] = useState(0);

    if (rows.length === 0) return null;

    const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);
    const pageRows = rows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    <h3 className="text-sm font-semibold text-white">Your Schedule</h3>
                    <span className="text-xs text-[var(--muted)] px-2 py-0.5 rounded-full bg-white/5">
                        {rows.length} tasks
                    </span>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-xs font-medium text-[var(--muted)] px-4 py-3 uppercase tracking-wider">Date</th>
                                <th className="text-left text-xs font-medium text-[var(--muted)] px-4 py-3 uppercase tracking-wider">Task</th>
                                <th className="text-left text-xs font-medium text-[var(--muted)] px-4 py-3 uppercase tracking-wider hidden sm:table-cell">Subtask</th>
                                <th className="text-left text-xs font-medium text-[var(--muted)] px-4 py-3 uppercase tracking-wider hidden md:table-cell">Difficulty</th>
                                <th className="text-left text-xs font-medium text-[var(--muted)] px-4 py-3 uppercase tracking-wider hidden lg:table-cell">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((row, idx) => {
                                const today = isToday(row.date);
                                return (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`border-b border-white/[0.03] transition-colors ${today
                                            ? 'bg-[var(--primary)]/8 border-l-2 border-l-[var(--primary)]'
                                            : 'hover:bg-white/[0.02]'
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {today && <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />}
                                                <span className={`text-sm ${today ? 'text-[var(--primary)] font-semibold' : 'text-[var(--muted)]'}`}>
                                                    {row.date ? new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : row.dateStr}
                                                </span>
                                                {today && (
                                                    <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded">
                                                        TODAY
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm font-medium ${today ? 'text-white' : 'text-white/80'}`}>
                                                {row.task}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="text-sm text-[var(--muted)]">{row.subtask || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {row.difficulty && (
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${difficultyColors[row.difficulty]}`}>
                                                    {row.difficulty.charAt(0).toUpperCase() + row.difficulty.slice(1)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            {row.category && (
                                                <span className="text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1 rounded-full">
                                                    {row.category}
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                        <span className="text-xs text-[var(--muted)]">
                            Page {page + 1} of {totalPages}
                        </span>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                disabled={page === totalPages - 1}
                                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
