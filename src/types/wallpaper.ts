export type ThemeName = 'dark' | 'neon' | 'anime' | 'minimal' | 'hacker';
export type AvatarType = 'boy' | 'girl';
export type AvatarStyle = 'casual' | 'student' | 'hacker' | 'anime';

export interface GradientStop {
    position: number;
    color: string;
}

export interface ThemeConfig {
    name: ThemeName;
    label: string;
    gradientType: 'linear' | 'radial';
    gradientStops: GradientStop[];
    primaryColor: string;
    accentColor: string;
    textColor: string;
    mutedTextColor: string;
    fontFamily: string;
    particleType: 'dots' | 'sparks' | 'petals' | 'none' | 'matrix';
    particleDensity: number;
    particleColor: string;
}

export interface WallpaperConfig {
    theme: ThemeName;
    avatarType: AvatarType;
    avatarStyle: AvatarStyle;
    task: string;
    subtask: string;
    category: string;
    difficulty: string;
    date: Date;
    customMessage?: string;
    xp: number;
    level: number;
    streak: number;
    progress: number;
}
