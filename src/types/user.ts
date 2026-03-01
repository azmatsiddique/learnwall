import { ThemeName, AvatarType, AvatarStyle } from './wallpaper';

export interface XPEvent {
    action: 'upload' | 'download' | 'streak_bonus' | 'share' | 'set_avatar' | 'complete_plan';
    xpDelta: number;
    timestamp: Date;
}

export const XP_REWARDS: Record<XPEvent['action'], number> = {
    upload: 50,
    download: 20,
    streak_bonus: 50,
    share: 10,
    set_avatar: 15,
    complete_plan: 200,
};

export const LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000,
];

export function getLevelFromXP(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
    }
    return 1;
}

export function getXPForNextLevel(xp: number): { current: number; needed: number } {
    const level = getLevelFromXP(xp);
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 5000;
    return {
        current: xp - currentThreshold,
        needed: nextThreshold - currentThreshold,
    };
}

export interface UserState {
    xp: number;
    level: number;
    streak: number;
    lastActive: string | null;
    theme: ThemeName;
    avatarType: AvatarType;
    avatarStyle: AvatarStyle;
    customMessage: string;
}
