import * as XLSX from 'xlsx';
import { ScheduleRow, ColumnMap, ParseResult, ParseError, Difficulty } from '@/types/schedule';
import { resolveDate } from './dateResolver';

const COLUMN_ALIASES: Record<keyof ColumnMap, string[]> = {
    date: ['date', 'day', 'dt', 'schedule date', 'study date', 'tarih', 'gün'],
    task: ['task', 'topic', 'subject', 'learning task', 'main task', 'görev', 'konu'],
    subtask: ['subtask', 'sub task', 'detail', 'chapter', 'focus', 'alt görev', 'detay'],
    difficulty: ['difficulty', 'level', 'diff', 'hard', 'zorluk', 'seviye'],
    category: ['category', 'cat', 'type', 'area', 'subject area', 'kategori', 'tür'],
};

function fuzzyMatch(header: string, aliases: string[]): boolean {
    const normalized = header.toLowerCase().trim().replace(/[_\-\.]/g, ' ');
    return aliases.some(alias => {
        const normalizedAlias = alias.toLowerCase().trim();
        return normalized === normalizedAlias || normalized.includes(normalizedAlias) || normalizedAlias.includes(normalized);
    });
}

function resolveColumns(headers: string[]): Partial<ColumnMap> {
    const colMap: Partial<ColumnMap> = {};

    headers.forEach((header, index) => {
        if (!header) return;
        for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
            if (fuzzyMatch(header, aliases) && !(key in colMap)) {
                colMap[key as keyof ColumnMap] = index;
                break;
            }
        }
    });

    return colMap;
}

function parseDifficulty(value: unknown): Difficulty {
    if (!value) return 'medium';
    const str = String(value).toLowerCase().trim();
    if (str === 'easy' || str === 'kolay') return 'easy';
    if (str === 'hard' || str === 'zor') return 'hard';
    return 'medium';
}

function mapRow(row: unknown[], colMap: Partial<ColumnMap>, index: number): { row: ScheduleRow; errors: ParseError[] } {
    const errors: ParseError[] = [];
    const dateVal = colMap.date !== undefined ? row[colMap.date] : null;
    const resolvedDate = resolveDate(dateVal);

    const task = colMap.task !== undefined ? String(row[colMap.task] || '').trim() : '';
    if (!task) {
        errors.push({ row: index + 2, column: 'task', message: 'Task is required' });
    }

    const scheduleRow: ScheduleRow = {
        id: `row-${index}`,
        date: resolvedDate,
        dateStr: resolvedDate ? resolvedDate.toLocaleDateString() : String(dateVal || ''),
        task,
        subtask: colMap.subtask !== undefined ? String(row[colMap.subtask] || '').trim() : '',
        difficulty: parseDifficulty(colMap.difficulty !== undefined ? row[colMap.difficulty] : null),
        category: colMap.category !== undefined ? String(row[colMap.category] || '').trim() : '',
        completed: false,
    };

    return { row: scheduleRow, errors };
}

export function parseScheduleFile(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(new Error('Failed to read file'));

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const wb = XLSX.read(data, { type: 'array', cellDates: true });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const raw = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

                if (raw.length < 2) {
                    resolve({ rows: [], errors: [{ row: 0, column: '', message: 'File is empty or has no data rows' }], totalRows: 0 });
                    return;
                }

                const headers = raw[0].map((h) => h?.toString().toLowerCase().trim() || '');
                const colMap = resolveColumns(headers);

                if (colMap.task === undefined) {
                    resolve({
                        rows: [],
                        errors: [{ row: 0, column: 'task', message: 'Could not find a "Task" column. Expected headers: task, topic, subject' }],
                        totalRows: 0,
                    });
                    return;
                }

                const allErrors: ParseError[] = [];
                const rows: ScheduleRow[] = [];

                raw.slice(1).forEach((r, idx) => {
                    if (r.every(cell => !cell)) return; // skip empty rows
                    const { row, errors } = mapRow(r, colMap, idx);
                    if (row.task) rows.push(row);
                    allErrors.push(...errors);
                });

                resolve({ rows, errors: allErrors, totalRows: rows.length });
            } catch (err) {
                reject(err);
            }
        };

        reader.readAsArrayBuffer(file);
    });
}

export function getTodayTask(rows: ScheduleRow[]): ScheduleRow | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return rows.find(row => {
        if (!row.date) return false;
        const rowDate = new Date(row.date);
        rowDate.setHours(0, 0, 0, 0);
        return rowDate.getTime() === today.getTime();
    }) || rows[0] || null;
}
