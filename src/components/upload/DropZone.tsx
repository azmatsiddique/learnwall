'use client';

import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseScheduleFile } from '@/lib/parser/excelParser';
import { useScheduleStore } from '@/store/scheduleStore';
import { useUserStore } from '@/store/userStore';

export default function DropZone() {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { setSchedule, fileName } = useScheduleStore();
    const { addXP } = useUserStore();

    const handleFile = useCallback(async (file: File) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
        ];
        const ext = file.name.split('.').pop()?.toLowerCase();

        if (!validTypes.includes(file.type) && ext !== 'xlsx' && ext !== 'csv' && ext !== 'xls') {
            setError('Please upload an Excel (.xlsx) or CSV (.csv) file');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await parseScheduleFile(file);
            if (result.rows.length === 0) {
                setError(result.errors[0]?.message || 'No data found in file');
                return;
            }
            setSchedule(result.rows, result.errors, file.name);
            addXP('upload');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to parse file. Please check the format.');
        } finally {
            setIsLoading(false);
        }
    }, [setSchedule, addXP]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    return (
        <div className="w-full">
            <motion.label
                htmlFor="file-upload"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragging
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.01]'
                        : success
                            ? 'border-[var(--success)] bg-[var(--success)]/5'
                            : error
                                ? 'border-[var(--danger)] bg-[var(--danger)]/5'
                                : 'border-[var(--border)] bg-[var(--surface)]/50 hover:border-[var(--primary)]/50 hover:bg-[var(--surface)]'
                    }`}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
            >
                <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.csv,.xls"
                    className="hidden"
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-12 h-12 rounded-full border-3 border-[var(--primary)] border-t-transparent animate-spin" />
                            <p className="text-sm text-[var(--muted)]">Parsing your schedule...</p>
                        </motion.div>
                    ) : success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <CheckCircle2 className="w-12 h-12 text-[var(--success)]" />
                            <p className="text-sm font-medium text-[var(--success)]">Schedule loaded! +50 XP ⚡</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 p-6"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDragging ? 'bg-[var(--primary)]/20' : 'bg-[var(--surface)]'
                                }`}>
                                {fileName ? (
                                    <FileSpreadsheet className="w-8 h-8 text-[var(--primary)]" />
                                ) : (
                                    <Upload className="w-8 h-8 text-[var(--muted)]" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-white">
                                    {fileName ? `Currently: ${fileName}` : 'Drop your schedule here'}
                                </p>
                                <p className="text-xs text-[var(--muted)] mt-1">
                                    {fileName ? 'Drop a new file to replace' : 'or click to browse · Supports .xlsx and .csv'}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.label>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/20"
                    >
                        <AlertCircle className="w-4 h-4 text-[var(--danger)] shrink-0" />
                        <p className="text-xs text-[var(--danger)]">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
