'use client';

import DropZone from '@/components/upload/DropZone';
import ScheduleTable from '@/components/upload/ScheduleTable';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download } from 'lucide-react';

export default function UploadPage() {
    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Upload Schedule</h1>
                <p className="text-sm text-[var(--muted)]">
                    Upload your Excel or CSV study plan to generate daily wallpapers
                </p>
            </motion.div>

            {/* Format instructions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-xl p-4"
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[var(--accent)]" />
                        <span className="text-xs font-semibold text-[var(--accent)]">EXPECTED FORMAT</span>
                    </div>
                    <a
                        href="/sample-schedule.csv"
                        download="learnwall-template.csv"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download Template
                    </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="bg-white/5 rounded-lg p-2">
                        <span className="text-[var(--primary)] font-semibold">Date</span>
                        <span className="text-red-400 ml-0.5">*</span>
                        <p className="text-[var(--muted)] mt-0.5">DD/MM/YYYY</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                        <span className="text-[var(--primary)] font-semibold">Task</span>
                        <span className="text-red-400 ml-0.5">*</span>
                        <p className="text-[var(--muted)] mt-0.5">Main topic</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                        <span className="text-[var(--muted)] font-semibold">Subtask</span>
                        <p className="text-[var(--muted)] mt-0.5">Detail/chapter</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                        <span className="text-[var(--muted)] font-semibold">Difficulty</span>
                        <p className="text-[var(--muted)] mt-0.5">Easy/Med/Hard</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                        <span className="text-[var(--muted)] font-semibold">Category</span>
                        <p className="text-[var(--muted)] mt-0.5">Subject area</p>
                    </div>
                </div>
            </motion.div>

            {/* Drop zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <DropZone />
            </motion.div>

            {/* Schedule table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <ScheduleTable />
            </motion.div>
        </div>
    );
}
