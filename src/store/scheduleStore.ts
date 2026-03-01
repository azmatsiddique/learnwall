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

            setSchedule: async (rows, errors, fileName) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayIndex = rows.findIndex(row => {
                    if (!row.date) return false;
                    const d = new Date(row.date);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() === today.getTime();
                });
                set({ rows, errors, fileName, todayIndex: todayIndex >= 0 ? todayIndex : 0 });

                // Sync directly to Supabase from the client
                const uid = getUid();
                if (uid && uid !== 'default') {
                    try {
                        const { createClient } = await import('@/lib/supabase/client');
                        const supabase = createClient();

                        await supabase.from('schedules').delete().eq('user_id', uid);

                        if (rows.length > 0) {
                            await supabase.from('schedules').insert(
                                rows.map(r => ({
                                    user_id: uid,
                                    date: r.date,
                                    task: r.task,
                                    subtask: r.subtask || '',
                                    difficulty: r.difficulty || 'medium',
                                    category: r.category || '',
                                    completed: r.completed || false
                                }))
                            );
                        }
                    } catch (e) {
                        console.error('Failed to sync schedule direct to Supabase:', e);
                    }
                }
            },

            clearSchedule: async () => {
                set({ rows: [], errors: [], fileName: null, todayIndex: -1 });
                // Clear from Supabase too
                const uid = getUid();
                if (uid && uid !== 'default') {
                    try {
                        const { createClient } = await import('@/lib/supabase/client');
                        const supabase = createClient();
                        await supabase.from('schedules').delete().eq('user_id', uid);
                    } catch (e) {
                        console.error('Failed to clear schedule direct from Supabase:', e);
                    }
                }
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
