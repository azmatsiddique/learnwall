const DATE_FORMATS = [
    // DD/MM/YYYY or DD-MM-YYYY
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
    // YYYY-MM-DD
    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
    // Day N pattern
    /^day\s*(\d+)$/i,
];

export function resolveDate(value: unknown, startDate?: Date): Date | null {
    if (!value) return null;

    if (value instanceof Date && !isNaN(value.getTime())) {
        return value;
    }

    const str = String(value).trim();
    if (!str) return null;

    // Try Day N pattern
    const dayMatch = str.match(/^day\s*(\d+)$/i);
    if (dayMatch) {
        const dayNum = parseInt(dayMatch[1], 10);
        const base = startDate || new Date();
        const result = new Date(base);
        result.setDate(result.getDate() + dayNum - 1);
        return result;
    }

    // Try DD/MM/YYYY
    const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
        const [, d, m, y] = dmyMatch;
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        if (!isNaN(date.getTime())) return date;
    }

    // Try YYYY-MM-DD
    const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (ymdMatch) {
        const [, y, m, d] = ymdMatch;
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        if (!isNaN(date.getTime())) return date;
    }

    // Try MM-DD-YYYY
    const mdyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (mdyMatch) {
        const [, m, d, y] = mdyMatch;
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        if (!isNaN(date.getTime())) return date;
    }

    // Fallback: try native Date.parse
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) return parsed;

    return null;
}

export function formatDate(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return String(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function isToday(date: Date | string | null): boolean {
    if (!date) return false;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}
