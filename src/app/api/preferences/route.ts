import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');

interface UserPreferences {
    theme: string;
    avatarType: string;
    avatarStyle: string;
    customMessage: string;
}

function getUserDir(uid: string): string {
    const safeUid = uid.replace(/[^a-z0-9]/gi, '').substring(0, 16);
    return path.join(DATA_DIR, safeUid || 'default');
}

async function ensureDir(dir: string) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch { /* exists */ }
}

export async function readPreferences(uid: string): Promise<UserPreferences> {
    try {
        const file = path.join(getUserDir(uid), 'preferences.json');
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { theme: 'dark', avatarType: 'boy', avatarStyle: 'casual', customMessage: '' };
    }
}

// POST: Save preferences
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const uid = body.uid || 'default';
        const prefs: UserPreferences = {
            theme: body.theme || 'dark',
            avatarType: body.avatarType || 'boy',
            avatarStyle: body.avatarStyle || 'casual',
            customMessage: body.customMessage || '',
        };

        const userDir = getUserDir(uid);
        await ensureDir(userDir);
        await fs.writeFile(path.join(userDir, 'preferences.json'), JSON.stringify(prefs, null, 2), 'utf-8');

        return NextResponse.json({ success: true, preferences: prefs });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to save preferences' }, { status: 500 });
    }
}

// GET: Read preferences
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid') || 'default';
    const prefs = await readPreferences(uid);
    return NextResponse.json(prefs);
}
