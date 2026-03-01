import { NextRequest, NextResponse } from 'next/server';
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
    // Sanitize uid to prevent path traversal
    const safeUid = uid.replace(/[^a-z0-9]/gi, '').substring(0, 16);
    return path.join(DATA_DIR, safeUid || 'default');
}

async function ensureDir(dir: string) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch { /* exists */ }
}

export async function readSchedule(uid: string): Promise<ScheduleEntry[]> {
    try {
        const file = path.join(getUserDir(uid), 'schedule.json');
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// POST: Save schedule from client
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const uid = body.uid || 'default';
        const rows: ScheduleEntry[] = body.rows || [];

        const userDir = getUserDir(uid);
        await ensureDir(userDir);
        await fs.writeFile(path.join(userDir, 'schedule.json'), JSON.stringify(rows, null, 2), 'utf-8');

        return NextResponse.json({
            success: true,
            count: rows.length,
            message: `Saved ${rows.length} schedule entries for user ${uid}`,
        });
    } catch {
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
