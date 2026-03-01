import { WallpaperConfig } from '@/types/wallpaper';
import { THEMES } from './themes';
import { drawParticles } from './particles';
import { drawAvatar } from './avatarRenderer';

function drawBackground(ctx: CanvasRenderingContext2D, config: WallpaperConfig) {
    const theme = THEMES[config.theme];
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    let grad: CanvasGradient;
    if (theme.gradientType === 'radial') {
        grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    } else {
        grad = ctx.createLinearGradient(0, 0, w * 0.5, h);
    }

    theme.gradientStops.forEach(stop => {
        grad.addColorStop(stop.position, stop.color);
    });

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Noise texture for minimal theme
    if (config.theme === 'minimal') {
        ctx.globalAlpha = 0.03;
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#FFF';
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
    }
}

function drawDecoShapes(ctx: CanvasRenderingContext2D, config: WallpaperConfig) {
    const theme = THEMES[config.theme];
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = theme.primaryColor;
    ctx.lineWidth = 1.5;

    // Decorative circles
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * w,
            Math.random() * h,
            50 + Math.random() * 150,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    // Decorative lines
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * w, Math.random() * h);
        ctx.lineTo(Math.random() * w, Math.random() * h);
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
}

function drawDateBadge(ctx: CanvasRenderingContext2D, date: Date | string, config: WallpaperConfig) {
    const theme = THEMES[config.theme];
    const w = ctx.canvas.width;

    // Ensure date is a Date object (handles Zustand localStorage serialization)
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateStr = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;

    ctx.font = `600 32px ${theme.fontFamily}`;
    const textWidth = ctx.measureText(dateStr).width;
    const pillW = textWidth + 60;
    const pillH = 56;
    const pillX = (w - pillW) / 2;
    const pillY = 120;

    // Pill background
    ctx.fillStyle = theme.primaryColor;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Date text
    ctx.fillStyle = config.theme === 'anime' ? '#FFFFFF' : config.theme === 'minimal' ? '#FFFFFF' : theme.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateStr, w / 2, pillY + pillH / 2);
}

function drawCategoryChip(ctx: CanvasRenderingContext2D, config: WallpaperConfig) {
    const theme = THEMES[config.theme];
    const w = ctx.canvas.width;

    if (!config.category) return;

    ctx.font = `500 24px ${theme.fontFamily}`;
    const textWidth = ctx.measureText(config.category.toUpperCase()).width;
    const chipW = textWidth + 40;
    const chipH = 40;
    const chipX = (w - chipW) / 2;
    const chipY = 200;

    ctx.fillStyle = theme.accentColor;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, chipW, chipH, chipH / 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = theme.accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.category.toUpperCase(), w / 2, chipY + chipH / 2);
}

function drawDifficultyBadge(ctx: CanvasRenderingContext2D, config: WallpaperConfig) {
    const theme = THEMES[config.theme];
    const w = ctx.canvas.width;

    if (!config.difficulty) return;

    const diffColors: Record<string, string> = {
        easy: '#22C55E',
        medium: '#F59E0B',
        hard: '#EF4444',
    };

    const color = diffColors[config.difficulty] || diffColors.medium;
    const label = config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1);

    ctx.font = `700 20px ${theme.fontFamily}`;
    const textWidth = ctx.measureText(label).width;
    const badgeW = textWidth + 30;
    const badgeH = 34;
    const badgeX = (w - badgeW) / 2;
    const badgeY = 252;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, badgeY + badgeH / 2);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
}

function drawTaskText(ctx: CanvasRenderingContext2D, config: WallpaperConfig) {
    const theme = THEMES[config.theme];
    const w = ctx.canvas.width;

    // Custom message or task title
    const title = config.customMessage || config.task;
    const maxWidth = w * 0.65;

    // Title
    ctx.font = `800 56px ${theme.fontFamily}`;
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const titleLines = wrapText(ctx, title, maxWidth);
    let y = 340;
    titleLines.forEach(line => {
        ctx.fillText(line, w / 2, y);
        y += 68;
    });

    // Subtask
    if (config.subtask) {
        ctx.font = `italic 400 32px ${theme.fontFamily}`;
        ctx.fillStyle = theme.mutedTextColor;
        const subtaskLines = wrapText(ctx, config.subtask, maxWidth);
        y += 16;
        subtaskLines.forEach(line => {
            ctx.fillText(line, w / 2, y);
            y += 42;
        });
    }
}

function drawStreakXPBar(ctx: CanvasRenderingContext2D, config: WallpaperConfig) {
    const theme = THEMES[config.theme];
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const barY = h - 160;

    // Streak flame
    ctx.font = `700 28px ${theme.fontFamily}`;
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = 'left';
    ctx.fillText(`🔥 ${config.streak} day streak`, 60, barY);

    // XP text
    ctx.textAlign = 'right';
    ctx.fillText(`⚡ ${config.xp} XP · Lv.${config.level}`, w - 60, barY);

    // Progress bar
    const barX = 60;
    const barW = w - 120;
    const barH = 12;
    const barBgY = barY + 30;

    // Background
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.roundRect(barX, barBgY, barW, barH, barH / 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Fill
    const fillW = barW * (config.progress / 100);
    ctx.fillStyle = theme.primaryColor;
    ctx.beginPath();
    ctx.roundRect(barX, barBgY, Math.max(fillW, barH), barH, barH / 2);
    ctx.fill();

    // Progress text
    ctx.font = `600 22px ${theme.fontFamily}`;
    ctx.fillStyle = theme.mutedTextColor;
    ctx.textAlign = 'center';
    ctx.fillText(`${config.progress}% Complete`, w / 2, barBgY + barH + 30);
}

function drawVignette(ctx: CanvasRenderingContext2D) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const vgn = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.7);
    vgn.addColorStop(0, 'transparent');
    vgn.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    ctx.fillStyle = vgn;
    ctx.fillRect(0, 0, w, h);
}

export async function generateWallpaper(config: WallpaperConfig): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;
    const theme = THEMES[config.theme];

    // 1. Background gradient
    drawBackground(ctx, config);

    // 2. Particles
    drawParticles(ctx, theme);

    // 3. Decorative shapes
    drawDecoShapes(ctx, config);

    // 4. Avatar
    drawAvatar(ctx, config.avatarType, config.avatarStyle, theme.primaryColor);

    // 5. Date badge
    drawDateBadge(ctx, config.date, config);

    // 6. Category chip
    drawCategoryChip(ctx, config);

    // 7. Difficulty badge
    drawDifficultyBadge(ctx, config);

    // 8. Task text
    drawTaskText(ctx, config);

    // 9. Streak + XP bar
    drawStreakXPBar(ctx, config);

    // 10. Vignette
    if (config.theme !== 'minimal') {
        drawVignette(ctx);
    }

    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob!), 'image/png');
    });
}

export function downloadWallpaper(blob: Blob, filename?: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `learnwall-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
