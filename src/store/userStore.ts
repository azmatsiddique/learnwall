import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLevelFromXP, XP_REWARDS, XPEvent } from '@/types/user';

function generateUID(): string {
    return Math.random().toString(36).substring(2, 10);
}

interface UserStoreState {
    uid: string;
    xp: number;
    level: number;
    streak: number;
    lastActive: string | null;
    xpEvents: Array<{ action: string; xp: number; date: string }>;
    addXP: (action: XPEvent['action']) => number;
    checkAndUpdateStreak: () => void;
    getProgress: (totalRows: number, completedRows: number) => number;
}

export const useUserStore = create<UserStoreState>()(
    persist(
        (set, get) => ({
            uid: generateUID(),
            xp: 0,
            level: 1,
            streak: 0,
            lastActive: null,
            xpEvents: [],

            addXP: (action) => {
                const xpDelta = XP_REWARDS[action];
                const newXP = get().xp + xpDelta;
                const newLevel = getLevelFromXP(newXP);
                set({
                    xp: newXP,
                    level: newLevel,
                    xpEvents: [
                        ...get().xpEvents,
                        { action, xp: xpDelta, date: new Date().toISOString() },
                    ],
                });
                return xpDelta;
            },

            checkAndUpdateStreak: () => {
                const today = new Date().toDateString();
                const { lastActive, streak } = get();

                if (lastActive === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastActive === yesterday.toDateString()) {
                    set({ streak: streak + 1, lastActive: today });
                } else if (!lastActive) {
                    set({ streak: 1, lastActive: today });
                } else {
                    set({ streak: 1, lastActive: today });
                }
            },

            getProgress: (totalRows, completedRows) => {
                if (totalRows === 0) return 0;
                return Math.round((completedRows / totalRows) * 100);
            },
        }),
        { name: 'learnwall-user' }
    )
);
