import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ScheduleEntry {
    date: string;
    task: string;
    subtask: string;
    difficulty: string;
    category: string;
    completed: boolean;
}

export async function readSchedule(uid: string): Promise<ScheduleEntry[]> {
    if (!uid || uid === 'default') return [];
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('schedules')
            .select('*')
            .eq('user_id', uid)
            .order('date', { ascending: true });

        if (!data) return [];
        return data as ScheduleEntry[];
    } catch {
        return [];
    }
}

// POST: Save schedule from client
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const uid = body.uid;
        const rows: ScheduleEntry[] = body.rows || [];

        if (!uid || uid === 'default') {
            return NextResponse.json({ success: false, error: 'Unauthorized user ID' }, { status: 401 });
        }

        const supabase = await createClient();

        // 1. Delete old schedule
        await supabase
            .from('schedules')
            .delete()
            .eq('user_id', uid);

        // 2. Insert new schedule
        if (rows.length > 0) {
            const insertData = rows.map(r => ({
                user_id: uid,
                date: r.date,
                task: r.task,
                subtask: r.subtask || '',
                difficulty: r.difficulty || 'medium',
                category: r.category || '',
                completed: r.completed || false
            }));

            const { error: insertError } = await supabase
                .from('schedules')
                .insert(insertData);

            if (insertError) {
                console.error('Supabase Insert Error:', insertError);
                throw new Error(insertError.message);
            }
        }

        return NextResponse.json({
            success: true,
            count: rows.length,
            message: `Saved ${rows.length} schedule entries for user ${uid}`,
        });
    } catch (e: any) {
        console.error('Schedule Save Error:', e);
        return NextResponse.json(
            { success: false, error: 'Failed to save schedule' },
            { status: 500 }
        );
    }
}

// GET: Read today's task
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid') || 'default';
    const rows = await readSchedule(uid);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTask = rows.find(row => {
        if (!row.date) return false;
        const d = new Date(row.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });

    const nextTask = !todayTask
        ? rows.find(row => {
            if (!row.date) return false;
            return new Date(row.date).getTime() > today.getTime();
        })
        : null;

    const task = todayTask || nextTask || null;

    return NextResponse.json({
        found: !!task,
        isToday: !!todayTask,
        task: task
            ? {
                date: task.date,
                task: task.task,
                subtask: task.subtask,
                difficulty: task.difficulty,
                category: task.category,
                completed: task.completed,
            }
            : null,
        totalEntries: rows.length,
    });
}
