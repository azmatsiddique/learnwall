import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UserPreferences {
    theme: string;
    avatarType: string;
    avatarStyle: string;
    customMessage: string;
}

export async function readPreferences(uid: string): Promise<UserPreferences> {
    const defaultPrefs = { theme: 'dark', avatarType: 'boy', avatarStyle: 'casual', customMessage: '' };
    if (!uid || uid === 'default') return defaultPrefs;

    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('preferences')
            .select('*')
            .eq('user_id', uid)
            .single();

        if (data) {
            return {
                theme: data.theme || 'dark',
                avatarType: data.avatar_type || 'boy',
                avatarStyle: data.avatar_style || 'casual',
                customMessage: data.custom_message || ''
            };
        }
        return defaultPrefs;
    } catch {
        return defaultPrefs;
    }
}

// POST: Save preferences
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const uid = body.uid;

        if (!uid || uid === 'default') {
            return NextResponse.json({ success: false, error: 'Unauthorized user ID' }, { status: 401 });
        }

        const prefs: UserPreferences = {
            theme: body.theme || 'dark',
            avatarType: body.avatarType || 'boy',
            avatarStyle: body.avatarStyle || 'casual',
            customMessage: body.customMessage || '',
        };

        const supabase = await createClient();

        const { error } = await supabase
            .from('preferences')
            .upsert({
                user_id: uid,
                theme: prefs.theme,
                avatar_type: prefs.avatarType,
                avatar_style: prefs.avatarStyle,
                custom_message: prefs.customMessage
            });

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, preferences: prefs });
    } catch (e: any) {
        console.error('Preferences Save Error:', e);
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
