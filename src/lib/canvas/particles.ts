import { ThemeConfig } from '@/types/wallpaper';

interface Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speedY?: number;
    char?: string;
    rotation?: number;
}

function createParticles(count: number, width: number, height: number): Particle[] {
    return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        speedY: Math.random() * 2 + 0.5,
        rotation: Math.random() * 360,
    }));
}

function drawDots(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number, h: number) {
    const particles = createParticles(theme.particleDensity, w, h);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme.particleColor.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();
    });
}

function drawSparks(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number, h: number) {
    const particles = createParticles(theme.particleDensity, w, h);
    particles.forEach(p => {
        const len = p.size * 4;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation! * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(-len / 2, 0);
        ctx.lineTo(len / 2, 0);
        ctx.strokeStyle = theme.particleColor;
        ctx.globalAlpha = p.opacity;
        ctx.lineWidth = 1;
        ctx.stroke();
        // Cross spark
        ctx.beginPath();
        ctx.moveTo(0, -len / 3);
        ctx.lineTo(0, len / 3);
        ctx.stroke();
        ctx.restore();
    });
    ctx.globalAlpha = 1;
}

function drawPetals(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number, h: number) {
    const particles = createParticles(theme.particleDensity, w, h);
    particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation! * Math.PI) / 180);
        ctx.globalAlpha = p.opacity * 0.7;

        // Draw petal shape
        ctx.beginPath();
        const size = p.size * 3 + 3;
        ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = theme.particleColor;
        ctx.fill();

        // Inner petal
        ctx.beginPath();
        ctx.ellipse(size * 0.2, 0, size * 0.5, size * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD4E5';
        ctx.fill();

        ctx.restore();
    });
    ctx.globalAlpha = 1;
}

function drawMatrixRain(ctx: CanvasRenderingContext2D, theme: ThemeConfig, w: number, h: number) {
    const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF';
    const columns = Math.floor(w / 20);
    const fontSize = 14;
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < columns; i++) {
        const x = i * 20;
        const columnHeight = Math.floor(Math.random() * 30) + 5;
        const startY = Math.random() * h;

        for (let j = 0; j < columnHeight; j++) {
            const y = startY + j * fontSize;
            if (y > h) break;

            const char = chars[Math.floor(Math.random() * chars.length)];
            const opacity = j === 0 ? 0.9 : Math.max(0.05, 0.6 - (j / columnHeight) * 0.5);

            ctx.globalAlpha = opacity;
            ctx.fillStyle = j === 0 ? '#FFFFFF' : theme.particleColor;
            ctx.fillText(char, x, y);
        }
    }
    ctx.globalAlpha = 1;
}

export function drawParticles(ctx: CanvasRenderingContext2D, theme: ThemeConfig) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    switch (theme.particleType) {
        case 'dots':
            drawDots(ctx, theme, w, h);
            break;
        case 'sparks':
            drawSparks(ctx, theme, w, h);
            break;
        case 'petals':
            drawPetals(ctx, theme, w, h);
            break;
        case 'matrix':
            drawMatrixRain(ctx, theme, w, h);
            break;
        case 'none':
        default:
            break;
    }
}
