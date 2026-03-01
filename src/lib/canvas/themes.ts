import { ThemeConfig, ThemeName } from '@/types/wallpaper';

export const THEMES: Record<ThemeName, ThemeConfig> = {
    dark: {
        name: 'dark',
        label: 'Dark',
        gradientType: 'linear',
        gradientStops: [
            { position: 0, color: '#0F0C29' },
            { position: 0.5, color: '#302B63' },
            { position: 1, color: '#24243E' },
        ],
        primaryColor: '#7C3AED',
        accentColor: '#A78BFA',
        textColor: '#FFFFFF',
        mutedTextColor: '#A8A8C8',
        fontFamily: 'Inter, sans-serif',
        particleType: 'dots',
        particleDensity: 40,
        particleColor: 'rgba(255, 255, 255, 0.3)',
    },
    neon: {
        name: 'neon',
        label: 'Neon',
        gradientType: 'radial',
        gradientStops: [
            { position: 0, color: '#0D0221' },
            { position: 1, color: '#000000' },
        ],
        primaryColor: '#00FF9F',
        accentColor: '#00D4FF',
        textColor: '#FFFFFF',
        mutedTextColor: '#8BFFC8',
        fontFamily: '"Exo 2", sans-serif',
        particleType: 'sparks',
        particleDensity: 80,
        particleColor: '#00FF9F',
    },
    anime: {
        name: 'anime',
        label: 'Anime',
        gradientType: 'linear',
        gradientStops: [
            { position: 0, color: '#FFF0F5' },
            { position: 1, color: '#E8D5F5' },
        ],
        primaryColor: '#FF6B9D',
        accentColor: '#FF9EC6',
        textColor: '#2D1B40',
        mutedTextColor: '#6B4D7A',
        fontFamily: '"Nunito", sans-serif',
        particleType: 'petals',
        particleDensity: 25,
        particleColor: '#FFB7D5',
    },
    minimal: {
        name: 'minimal',
        label: 'Minimal',
        gradientType: 'linear',
        gradientStops: [
            { position: 0, color: '#F8F9FA' },
            { position: 1, color: '#F0F1F3' },
        ],
        primaryColor: '#1A1A2E',
        accentColor: '#4A4A6A',
        textColor: '#1A1A2E',
        mutedTextColor: '#6B6B8A',
        fontFamily: '"Inter", sans-serif',
        particleType: 'none',
        particleDensity: 0,
        particleColor: 'transparent',
    },
    hacker: {
        name: 'hacker',
        label: 'Hacker',
        gradientType: 'linear',
        gradientStops: [
            { position: 0, color: '#0D1117' },
            { position: 1, color: '#161B22' },
        ],
        primaryColor: '#00FF41',
        accentColor: '#39FF14',
        textColor: '#00FF41',
        mutedTextColor: '#238636',
        fontFamily: '"JetBrains Mono", monospace',
        particleType: 'matrix',
        particleDensity: 60,
        particleColor: '#00FF41',
    },
};

export function getThemePreviewColors(name: ThemeName): { bg: string; accent: string; text: string } {
    const t = THEMES[name];
    return {
        bg: t.gradientStops[0].color,
        accent: t.primaryColor,
        text: t.textColor,
    };
}
