import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

const PHONE_MODELS: Record<string, { w: number; h: number; label: string }> = {
    'iphone-13-mini': { w: 1080, h: 2340, label: 'iPhone 13 mini' },
    'iphone-13': { w: 1170, h: 2532, label: 'iPhone 13 / 13 Pro' },
    'iphone-13-pro-max': { w: 1284, h: 2778, label: 'iPhone 13 Pro Max' },
    'iphone-14': { w: 1170, h: 2532, label: 'iPhone 14 / 14 Pro' },
    'iphone-14-plus': { w: 1284, h: 2778, label: 'iPhone 14 Plus' },
    'iphone-14-pro-max': { w: 1290, h: 2796, label: 'iPhone 14 Pro Max' },
    'iphone-15': { w: 1179, h: 2556, label: 'iPhone 15 / 15 Pro' },
    'iphone-15-plus': { w: 1290, h: 2796, label: 'iPhone 15 Plus / Pro Max' },
    'iphone-16': { w: 1179, h: 2556, label: 'iPhone 16' },
    'iphone-16-pro': { w: 1206, h: 2622, label: 'iPhone 16 Pro' },
    'iphone-16-pro-max': { w: 1320, h: 2868, label: 'iPhone 16 Pro Max' },
    'samsung-s24': { w: 1080, h: 2340, label: 'Samsung Galaxy S24' },
    'samsung-s24-plus': { w: 1440, h: 3120, label: 'Samsung Galaxy S24+' },
    'samsung-s24-ultra': { w: 1440, h: 3120, label: 'Samsung Galaxy S24 Ultra' },
    'samsung-a54': { w: 1080, h: 2340, label: 'Samsung Galaxy A54' },
    'pixel-8': { w: 1080, h: 2400, label: 'Google Pixel 8' },
    'pixel-8-pro': { w: 1344, h: 2992, label: 'Google Pixel 8 Pro' },
    'generic-hd': { w: 1080, h: 1920, label: 'Generic HD (1080×1920)' },
    'generic-fhd': { w: 1080, h: 2400, label: 'Generic FHD+ (1080×2400)' },
};

const DEFAULT_MODEL = 'generic-fhd';

const THEMES: Record<string, { bgStops: string[]; text: string; accent: string; muted: string }> = {
    dark: { bgStops: ['#0F0C29', '#302B63', '#24243E'], text: '#FFFFFF', accent: '#7C3AED', muted: '#9CA3AF' },
    neon: { bgStops: ['#000000', '#0D0221', '#0D0221'], text: '#FFFFFF', accent: '#00FF9F', muted: '#4ADE80' },
    anime: { bgStops: ['#FFF0F5', '#F8E8F0', '#E8D5F5'], text: '#2D1B4E', accent: '#FF6B9D', muted: '#8B5E83' },
    minimal: { bgStops: ['#F8F9FA', '#F0F1F3', '#E8E9EB'], text: '#1A1A2E', accent: '#1A1A2E', muted: '#6B7280' },
    hacker: { bgStops: ['#0D1117', '#161B22', '#0D1117'], text: '#00FF41', accent: '#00FF41', muted: '#238636' },
};

const QUOTES = [
    "Consistency beats intensity.",
    "Small steps, big results.",
    "Learn something new today.",
    "Progress, not perfection.",
    "Your future self will thank you.",
    "Every expert was once a beginner.",
    "Stay curious, keep learning.",
    "One day at a time.",
    "Discipline is the bridge.",
    "Today's effort, tomorrow's reward.",
];

function getDailyQuote(): string {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return QUOTES[dayOfYear % QUOTES.length];
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    let model = searchParams.get('model') || DEFAULT_MODEL;
    let customMsg = searchParams.get('msg') || '';
    let themeName = searchParams.get('theme') || 'dark';
    let avatarType = searchParams.get('avatar') || 'boy';
    let task = searchParams.get('task') || 'Upload your schedule';
    let subtask = searchParams.get('subtask') || 'Start learning today!';
    let category = searchParams.get('category') || '';
    let difficulty = searchParams.get('difficulty') || '';

    if (uid && uid !== 'default') {
        try {
            const supabase = await createClient();

            // 1. Fetch Preferences
            const { data: prefs } = await supabase
                .from('preferences')
                .select('*')
                .eq('user_id', uid)
                .single();

            if (prefs) {
                themeName = searchParams.get('theme') || prefs.theme || 'dark';
                avatarType = searchParams.get('avatar') || prefs.avatar_type || 'boy';
                customMsg = searchParams.get('msg') || prefs.custom_message || '';
            }

            // 2. Fetch Today's Task
            const todayStr = new Date().toLocaleDateString('en-CA');
            const { data: schedules } = await supabase
                .from('schedules')
                .select('*')
                .eq('user_id', uid)
                .gte('date', todayStr)
                .order('date', { ascending: true })
                .limit(1);

            if (schedules && schedules.length > 0) {
                const s = schedules[0];
                task = searchParams.get('task') || s.task;
                subtask = searchParams.get('subtask') || (s.subtask || '');
                category = searchParams.get('category') || (s.category || '');
                difficulty = searchParams.get('difficulty') || (s.difficulty || 'medium');
            }
        } catch (e) {
            console.error('Error fetching from Supabase for wallpaper:', e);
        }
    }

    const phone = PHONE_MODELS[model] || PHONE_MODELS[DEFAULT_MODEL];
    const { w, h } = phone;
    const s = w / 1080;
    const theme = THEMES[themeName] || THEMES.dark;

    const diffColors: Record<string, string> = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };
    const diffColor = diffColors[difficulty.toLowerCase()] || diffColors.medium;
    const diffLabel = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : '';

    const quote = customMsg || getDailyQuote();

    // Body dimensions for Satori Layout
    const avatarScale = s * 1.5;

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(to bottom, ${theme.bgStops[0]}, ${theme.bgStops[1]}, ${theme.bgStops.at(-1)})`,
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '20%', left: '15%', width: 500 * s, height: 500 * s, borderRadius: '50%', backgroundColor: theme.accent, opacity: 0.1 }} />
                <div style={{ position: 'absolute', top: '65%', left: '80%', width: 400 * s, height: 400 * s, borderRadius: '50%', backgroundColor: theme.accent, opacity: 0.08 }} />

                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: h * 0.38, width: '100%' }}>
                    {category && (
                        <div style={{ display: 'flex', background: `${theme.accent}40`, padding: `${10 * s}px ${30 * s}px`, borderRadius: 40 * s, marginBottom: 20 * s }}>
                            <span style={{ fontSize: 24 * s, fontWeight: 600, color: theme.accent, letterSpacing: '0.05em' }}>
                                {category.toUpperCase()}
                            </span>
                        </div>
                    )}

                    {diffLabel && (
                        <div style={{ display: 'flex', background: `${diffColor}33`, padding: `${8 * s}px ${24 * s}px`, borderRadius: 30 * s, marginBottom: 40 * s }}>
                            <span style={{ fontSize: 22 * s, fontWeight: 700, color: diffColor }}>
                                {diffLabel}
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'flex', fontSize: 60 * s, fontWeight: 800, color: theme.text, textAlign: 'center', padding: '0 40px', lineHeight: 1.1 }}>
                        {task}
                    </div>

                    {subtask && (
                        <div style={{ display: 'flex', fontSize: 32 * s, fontWeight: 400, fontStyle: 'italic', color: theme.muted, marginTop: 30 * s, textAlign: 'center', padding: '0 60px' }}>
                            {subtask}
                        </div>
                    )}

                    <div style={{ display: 'flex', fontSize: 28 * s, fontWeight: 500, fontStyle: 'italic', color: theme.muted, marginTop: 80 * s, opacity: 0.7, textAlign: 'center', padding: '0 60px' }}>
                        "{quote}"
                    </div>
                </div>

                {/* Avatar Area */}
                <div style={{ display: 'flex', position: 'absolute', top: h * 0.65, flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', width: 100 * avatarScale, height: 100 * avatarScale, borderRadius: '50%', background: '#FFD5C2', position: 'relative', overflow: 'hidden' }}>
                        {/* Eyes */}
                        <div style={{ position: 'absolute', width: 8 * avatarScale, height: 8 * avatarScale, borderRadius: '50%', background: '#333', top: 40 * avatarScale, left: 30 * avatarScale }} />
                        <div style={{ position: 'absolute', width: 8 * avatarScale, height: 8 * avatarScale, borderRadius: '50%', background: '#333', top: 40 * avatarScale, right: 30 * avatarScale }} />
                        {/* Smile */}
                        <svg style={{ position: 'absolute', top: 55 * avatarScale, left: 38 * avatarScale }} width={24 * avatarScale} height={12 * avatarScale} viewBox="0 0 24 12" fill="none" stroke="#333" strokeWidth={3 * avatarScale} strokeLinecap="round">
                            <path d="M 0 0 Q 12 12 24 0" />
                        </svg>

                        {/* Hair */}
                        {avatarType === 'girl' ? (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 40 * avatarScale, background: '#4A2C2A', borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }} />
                        ) : (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 35 * avatarScale, background: '#3D2C1E' }} />
                        )}
                    </div>
                    {/* Body */}
                    <div style={{ width: 140 * avatarScale, height: 100 * avatarScale, background: theme.accent, borderTopLeftRadius: 50 * avatarScale, borderTopRightRadius: 50 * avatarScale, marginTop: -15 * avatarScale }} />
                </div>

                {/* Streak/XP Bar */}
                <div style={{ display: 'flex', position: 'absolute', bottom: 100 * s, width: '100%', flexDirection: 'column', padding: `0 ${60 * s}px` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 20 * s }}>
                        <span style={{ fontSize: 32 * s, fontWeight: 700, color: theme.text }}>🔥 0 day streak</span>
                        <span style={{ fontSize: 32 * s, fontWeight: 700, color: theme.text }}>⚡ 0 XP</span>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: 16 * s, background: `${theme.text}22`, borderRadius: 8 * s, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', height: '100%', width: '10%', background: theme.accent, borderRadius: 8 * s }} />
                    </div>
                </div>

            </div>
        ),
        {
            width: w,
            height: h,
        }
    );
}

export async function OPTIONS() {
    return NextResponse.json({
        models: Object.entries(PHONE_MODELS).map(([id, m]) => ({ id, label: m.label, width: m.w, height: m.h })),
    }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
