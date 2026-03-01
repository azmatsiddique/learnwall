import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');

interface ScheduleEntry {
    date: string;
    task: string;
    subtask: string;
    difficulty: string;
    category: string;
    completed: boolean;
}

function getUserDir(uid: string): string {
    const safeUid = uid.replace(/[^a-z0-9]/gi, '').substring(0, 16);
    return path.join(DATA_DIR, safeUid || 'default');
}

async function getTodayTask(uid: string): Promise<ScheduleEntry | null> {
    try {
        const file = path.join(getUserDir(uid), 'schedule.json');
        const data = await fs.readFile(file, 'utf-8');
        const rows: ScheduleEntry[] = JSON.parse(data);
        if (!rows.length) return null;

        const todayStr = new Date().toLocaleDateString('en-CA');

        const todayTask = rows.find(row => {
            if (!row.date) return false;
            const rowDateStr = new Date(row.date).toLocaleDateString('en-CA');
            return rowDateStr === todayStr;
        });

        if (todayTask) return todayTask;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextTask = rows.find(row => {
            if (!row.date) return false;
            return new Date(row.date).getTime() > today.getTime();
        });

        return nextTask || rows[0];
    } catch {
        return null;
    }
}

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

const THEMES: Record<string, {
    bgStops: string[];
    text: string;
    accent: string;
    muted: string;
    cardBg: string;
}> = {
    dark: {
        bgStops: ['#0F0C29', '#302B63', '#24243E'],
        text: '#FFFFFF',
        accent: '#7C3AED',
        muted: '#9CA3AF',
        cardBg: 'rgba(255,255,255,0.06)',
    },
    neon: {
        bgStops: ['#000000', '#0D0221', '#0D0221'],
        text: '#FFFFFF',
        accent: '#00FF9F',
        muted: '#4ADE80',
        cardBg: 'rgba(255,255,255,0.06)',
    },
    anime: {
        bgStops: ['#FFF0F5', '#F8E8F0', '#E8D5F5'],
        text: '#2D1B4E',
        accent: '#FF6B9D',
        muted: '#8B5E83',
        cardBg: 'rgba(0,0,0,0.05)',
    },
    minimal: {
        bgStops: ['#F8F9FA', '#F0F1F3', '#E8E9EB'],
        text: '#1A1A2E',
        accent: '#1A1A2E',
        muted: '#6B7280',
        cardBg: 'rgba(0,0,0,0.04)',
    },
    hacker: {
        bgStops: ['#0D1117', '#161B22', '#0D1117'],
        text: '#00FF41',
        accent: '#00FF41',
        muted: '#238636',
        cardBg: 'rgba(0,255,65,0.06)',
    },
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
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
}

function escapeXml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateSVG(
    w: number,
    h: number,
    themeName: string,
    task: string,
    subtask: string,
    customMsg: string,
    category: string,
    difficulty: string,
    avatarType: string,
): string {
    const theme = THEMES[themeName] || THEMES.dark;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    const quote = escapeXml(customMsg || getDailyQuote());
    const displayTask = escapeXml(task || 'Upload your schedule');
    const displaySubtask = escapeXml(subtask || 'Start learning today!');
    const displayCategory = escapeXml(category || '');
    const displayDifficulty = difficulty || '';

    const s = w / 1080;
    const cx = w / 2;
    // Top offset: push content below iOS lock screen clock (~38% of height)
    const top = h * 0.38;

    const diffColors: Record<string, string> = { easy: '#22C55E', medium: '#F59E0B', hard: '#EF4444' };
    const diffColor = diffColors[displayDifficulty] || diffColors.medium;
    const diffLabel = displayDifficulty ? displayDifficulty.charAt(0).toUpperCase() + displayDifficulty.slice(1) : '';

    const bodyColor = theme.accent;
    // Avatar center Y — between content and XP bar
    const avatarY = h * 0.65;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${w * 0.5}" y2="${h}">
      ${theme.bgStops.map((c, i) => `<stop offset="${(i / (theme.bgStops.length - 1)) * 100}%" stop-color="${c}"/>`).join('\n      ')}
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.35)"/>
    </radialGradient>
    <filter id="bl1"><feGaussianBlur stdDeviation="${80 * s}"/></filter>
    <filter id="bl2"><feGaussianBlur stdDeviation="${50 * s}"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${200 * s}" cy="${h * 0.2}" r="${250 * s}" fill="${theme.accent}" opacity="0.07" filter="url(#bl1)"/>
  <circle cx="${880 * s}" cy="${h * 0.65}" r="${200 * s}" fill="${theme.accent}" opacity="0.05" filter="url(#bl2)"/>
  <circle cx="${150 * s}" cy="${h * 0.5}" r="${100 * s}" fill="none" stroke="${theme.accent}" stroke-opacity="0.06" stroke-width="${1.5 * s}"/>
  <circle cx="${900 * s}" cy="${h * 0.3}" r="${70 * s}" fill="none" stroke="${theme.accent}" stroke-opacity="0.06" stroke-width="${1.5 * s}"/>

  <!-- Date pill removed per user request -->

  <!-- Category chip -->
  ${displayCategory ? `<rect x="${cx - 80 * s}" y="${top + 65 * s}" width="${160 * s}" height="${34 * s}" rx="${17 * s}" fill="${theme.accent}" fill-opacity="0.25"/>
  <text x="${cx}" y="${top + 87 * s}" font-family="Arial,sans-serif" font-size="${19 * s}" font-weight="500" fill="${theme.accent}" text-anchor="middle">${displayCategory.toUpperCase()}</text>` : ''}

  <!-- Difficulty badge -->
  ${diffLabel ? `<rect x="${cx - 45 * s}" y="${top + 108 * s}" width="${90 * s}" height="${30 * s}" rx="${15 * s}" fill="${diffColor}" fill-opacity="0.2"/>
  <text x="${cx}" y="${top + 128 * s}" font-family="Arial,sans-serif" font-size="${17 * s}" font-weight="700" fill="${diffColor}" text-anchor="middle">${diffLabel}</text>` : ''}

  <!-- Task title -->
  <text x="${cx}" y="${top + 195 * s}" font-family="Arial,sans-serif" font-size="${48 * s}" font-weight="800" fill="${theme.text}" text-anchor="middle">${displayTask}</text>
  <!-- Subtask -->
  <text x="${cx}" y="${top + 245 * s}" font-family="Arial,sans-serif" font-size="${28 * s}" font-weight="400" font-style="italic" fill="${theme.muted}" text-anchor="middle">${displaySubtask}</text>

  <!-- Quote -->
  <text x="${cx}" y="${top + 320 * s}" font-family="Arial,sans-serif" font-size="${24 * s}" font-weight="500" font-style="italic" fill="${theme.muted}" text-anchor="middle" opacity="0.7">&quot;${quote}&quot;</text>

  <!-- Avatar -->
  <circle cx="${cx}" cy="${avatarY}" r="${50 * s}" fill="#FFD5C2"/>
  <circle cx="${cx - 16 * s}" cy="${avatarY - 7 * s}" r="${4.5 * s}" fill="#333"/>
  <circle cx="${cx + 16 * s}" cy="${avatarY - 7 * s}" r="${4.5 * s}" fill="#333"/>
  <path d="M ${cx - 12 * s} ${avatarY + 10 * s} Q ${cx} ${avatarY + 24 * s} ${cx + 12 * s} ${avatarY + 10 * s}" fill="none" stroke="#333" stroke-width="${2.5 * s}" stroke-linecap="round"/>
  ${avatarType === 'girl' ? `<path d="M ${cx - 50 * s} ${avatarY} Q ${cx - 55 * s} ${avatarY - 62 * s} ${cx} ${avatarY - 50 * s} Q ${cx + 55 * s} ${avatarY - 62 * s} ${cx + 50 * s} ${avatarY}" fill="#4A2C2A" opacity="0.9"/>
  <path d="M ${cx - 52 * s} ${avatarY} L ${cx - 50 * s} ${avatarY + 55 * s}" fill="none" stroke="#4A2C2A" stroke-width="${14 * s}" stroke-linecap="round" opacity="0.9"/>
  <path d="M ${cx + 52 * s} ${avatarY} L ${cx + 50 * s} ${avatarY + 55 * s}" fill="none" stroke="#4A2C2A" stroke-width="${14 * s}" stroke-linecap="round" opacity="0.9"/>` : `<path d="M ${cx - 45 * s} ${avatarY - 18 * s} Q ${cx - 50 * s} ${avatarY - 58 * s} ${cx} ${avatarY - 50 * s} Q ${cx + 50 * s} ${avatarY - 58 * s} ${cx + 45 * s} ${avatarY - 18 * s}" fill="#3D2C1E" opacity="0.9"/>`}
  <path d="M ${cx - 40 * s} ${avatarY + 50 * s} Q ${cx - 50 * s} ${avatarY + 90 * s} ${cx - 45 * s} ${avatarY + 125 * s} L ${cx + 45 * s} ${avatarY + 125 * s} Q ${cx + 50 * s} ${avatarY + 90 * s} ${cx + 40 * s} ${avatarY + 50 * s}" fill="${bodyColor}" opacity="0.8"/>

  <!-- Streak / XP bar -->
  <text x="${60 * s}" y="${h - 160 * s}" font-family="Arial,sans-serif" font-size="${26 * s}" font-weight="700" fill="${theme.text}">🔥 0 day streak</text>
  <text x="${w - 60 * s}" y="${h - 160 * s}" font-family="Arial,sans-serif" font-size="${26 * s}" font-weight="700" fill="${theme.text}" text-anchor="end">⚡ 0 XP · Lv.1</text>
  <rect x="${60 * s}" y="${h - 120 * s}" width="${w - 120 * s}" height="${12 * s}" rx="${6 * s}" fill="${theme.text}" fill-opacity="0.15"/>
  <rect x="${60 * s}" y="${h - 120 * s}" width="${12 * s}" height="${12 * s}" rx="${6 * s}" fill="${theme.accent}"/>
  <text x="${cx}" y="${h - 85 * s}" font-family="Arial,sans-serif" font-size="${20 * s}" font-weight="600" fill="${theme.muted}" text-anchor="middle">0% Complete</text>

  <rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;
}

export const phoneModels = PHONE_MODELS;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid') || 'default';
    const model = searchParams.get('model') || DEFAULT_MODEL;
    const format = searchParams.get('format');
    const customMsg = searchParams.get('msg') || '';

    let themeName = searchParams.get('theme') || '';
    let avatarType = searchParams.get('avatar') || '';

    // Read preferences from server if not in URL
    if (!themeName || !avatarType) {
        try {
            const { readPreferences } = await import('@/app/api/preferences/route');
            const prefs = await readPreferences(uid);
            if (!themeName) themeName = prefs.theme;
            if (!avatarType) avatarType = prefs.avatarType;
        } catch {
            if (!themeName) themeName = 'dark';
            if (!avatarType) avatarType = 'boy';
        }
    }

    let task = searchParams.get('task') || '';
    let subtask = searchParams.get('subtask') || '';
    let category = '';
    let difficulty = '';

    if (!task) {
        const todayTask = await getTodayTask(uid);
        if (todayTask) {
            task = todayTask.task;
            subtask = todayTask.subtask || '';
            category = todayTask.category || '';
            difficulty = todayTask.difficulty || '';
        }
    }

    const phone = PHONE_MODELS[model] || PHONE_MODELS[DEFAULT_MODEL];
    const { w, h } = phone;

    const svg = generateSVG(w, h, themeName, task, subtask, customMsg, category, difficulty, avatarType);
    const svgBuffer = Buffer.from(svg, 'utf-8');

    if (format === 'svg') {
        return new NextResponse(svgBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Content-Disposition': `inline; filename="learnwall-${model}.svg"`,
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pngBuffer = await sharp(svgBuffer).resize(w, h).png().toBuffer();

    return new NextResponse(pngBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `inline; filename="learnwall-${model}.png"`,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
        },
    });
}

export async function OPTIONS() {
    return NextResponse.json({
        models: Object.entries(PHONE_MODELS).map(([id, m]) => ({
            id, label: m.label, width: m.w, height: m.h,
        })),
    }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
    });
}
