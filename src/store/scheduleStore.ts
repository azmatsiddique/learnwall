import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ScheduleRow, ParseError } from '@/types/schedule';

function getUid(): string {
    try {
        const stored = JSON.parse(localStorage.getItem('learnwall-user') || '{}');
        return stored?.state?.uid || 'default';
    } catch { return 'default'; }
}

interface ScheduleState {
    rows: ScheduleRow[];
    errors: ParseError[];
    fileName: string | null;
    todayIndex: number;
    setSchedule: (rows: ScheduleRow[], errors: ParseError[], fileName: string) => void;
    clearSchedule: () => void;
    updateRow: (id: string, updates: Partial<ScheduleRow>) => void;
    markCompleted: (id: string) => void;
}

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set, get) => ({
            rows: [],
            errors: [],
            fileName: null,
            todayIndex: -1,

            setSchedule: (rows, errors, fileName) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayIndex = rows.findIndex(row => {
                    if (!row.date) return false;
                    const d = new Date(row.date);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() === today.getTime();
                });
                set({ rows, errors, fileName, todayIndex: todayIndex >= 0 ? todayIndex : 0 });

                // Sync to server for wallpaper API access
                const uid = getUid();
                fetch('/api/schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid,
                        rows: rows.map(r => ({
                            date: r.date,
                            task: r.task,
                            subtask: r.subtask,
                            difficulty: r.difficulty,
                            category: r.category,
                            completed: r.completed,
                        })),
                    }),
                }).catch(() => { });
            },

            clearSchedule: () => {
                set({ rows: [], errors: [], fileName: null, todayIndex: -1 });
                // Clear server-side too
                fetch('/api/schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: getUid(), rows: [] }),
                }).catch(() => { });
            },

            updateRow: (id, updates) => set(state => ({
                rows: state.rows.map(row => row.id === id ? { ...row, ...updates } : row),
            })),

            markCompleted: (id) => set(state => ({
                rows: state.rows.map(row => row.id === id ? { ...row, completed: true } : row),
            })),
        }),
        { name: 'learnwall-schedule' }
    )
);
