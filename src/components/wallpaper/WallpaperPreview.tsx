'use client';

import { useEffect, useRef, useState } from 'react';
import { useWallpaperStore } from '@/store/wallpaperStore';
import { useScheduleStore } from '@/store/scheduleStore';
import { useUserStore } from '@/store/userStore';
import { generateWallpaper, downloadWallpaper } from '@/lib/canvas/wallpaperEngine';
import { getTodayTask } from '@/lib/parser/excelParser';
import { WallpaperConfig } from '@/types/wallpaper';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Share2, Loader2 } from 'lucide-react';

export default function WallpaperPreview() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, avatarType, avatarStyle, customMessage, isGenerating, setGeneratedBlob, setIsGenerating } = useWallpaperStore();
    const { rows } = useScheduleStore();
    const { xp, level, streak, addXP, checkAndUpdateStreak } = useUserStore();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);

    const todayTask = getTodayTask(rows);
    const completedCount = rows.filter(r => r.completed).length;
    const progress = rows.length > 0 ? Math.round((completedCount / rows.length) * 100) : 0;

    const config: WallpaperConfig = {
        theme,
        avatarType,
        avatarStyle,
        task: todayTask?.task || 'Upload your schedule',
        subtask: todayTask?.subtask || 'Start learning today!',
        category: todayTask?.category || '',
        difficulty: todayTask?.difficulty || 'medium',
        date: todayTask?.date || new Date(),
        customMessage: customMessage || undefined,
        xp,
        level,
        streak,
        progress,
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const blob = await generateWallpaper(config);
            setCurrentBlob(blob);
            setGeneratedBlob(blob);

            if (previewUrl) URL.revokeObjectURL(previewUrl);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (err) {
            console.error('Failed to generate wallpaper:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (currentBlob) {
            downloadWallpaper(currentBlob);
            checkAndUpdateStreak();
            addXP('download');
        }
    };

    const handleShare = async () => {
        if (!currentBlob) return;
        try {
            if (navigator.share) {
                const file = new File([currentBlob], 'learnwall.png', { type: 'image/png' });
                await navigator.share({ files: [file], title: 'My LearnWall', text: `Today's task: ${config.task}` });
                addXP('share');
            } else {
                handleDownload();
            }
        } catch {
            // User cancelled share
        }
    };

    // Auto-generate on first load and preference changes
    useEffect(() => {
        handleGenerate();
    }, [theme, avatarType, avatarStyle]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Preview */}
            <div className="relative w-full max-w-[270px] aspect-[9/16] rounded-2xl overflow-hidden bg-[var(--surface)] glow-primary">
                {previewUrl ? (
                    <motion.img
                        key={previewUrl}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={previewUrl}
                        alt="Wallpaper preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-[var(--primary)] animate-spin" />
                            </div>
                            <p className="text-xs text-[var(--muted)]">Generating...</p>
                        </div>
                    </div>
                )}

                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </motion.div>
                )}
            </div>

            {/* Custom message input */}
            <div className="w-full max-w-[270px]">
                <input
                    type="text"
                    placeholder="Custom motivational quote..."
                    value={customMessage}
                    onChange={(e) => useWallpaperStore.getState().setCustomMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--surface)] border border-[var(--border)] text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 w-full max-w-[270px]">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--surface)] text-white text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                </motion.button>
            </div>

            <div className="flex gap-2 w-full max-w-[270px]">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={!currentBlob || isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 animate-pulse-glow"
                >
                    <Download className="w-4 h-4" />
                    Download
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    disabled={!currentBlob}
                    className="px-4 py-3 rounded-xl bg-[var(--surface)] text-white hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
                >
                    <Share2 className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );
}
