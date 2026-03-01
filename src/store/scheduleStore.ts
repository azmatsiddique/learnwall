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

                        const validRows = rows.filter(r => r.date);

                        if (validRows.length > 0) {
                            const { error } = await supabase.from('schedules').insert(
                                validRows.map(r => {
                                    // strictly format as YYYY-MM-DD in local time to prevent UTC timezone shifting
                                    const d = r.date instanceof Date ? r.date : new Date(r.date as unknown as string);
                                    const year = d.getFullYear();
                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                    const day = String(d.getDate()).padStart(2, '0');
                                    const dateStr = `${year}-${month}-${day}`;

                                    return {
                                        user_id: uid,
                                        date: dateStr,
                                        task: r.task,
                                        subtask: r.subtask || '',
                                        difficulty: r.difficulty || 'medium',
                                        category: r.category || '',
                                        completed: r.completed || false
                                    };
                                })
                            );
                            if (error) {
                                console.error('Supabase raw insert error:', error);
                                alert('Database error saving schedule: ' + error.message);
                            }
                        }
                    } catch (e: any) {
                        console.error('Failed to sync schedule direct to Supabase:', e);
                        alert('Sync error: ' + (e?.message || 'Unknown network error'));
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
