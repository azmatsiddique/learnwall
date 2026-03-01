import { AvatarType, AvatarStyle, ThemeConfig } from '@/types/wallpaper';

// Generate placeholder avatar SVGs directly on canvas
// These are stylized silhouettes with theme-colored accents

function drawBoyAvatar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, accent: string, style: AvatarStyle) {
    ctx.save();

    // Body
    const bodyY = y + h * 0.55;
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, bodyY + h * 0.25, w * 0.35, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.beginPath();
    ctx.roundRect(x + w * 0.25, bodyY - h * 0.02, w * 0.5, h * 0.3, 12);
    ctx.fill();

    // Head
    const headCenterX = x + w / 2;
    const headCenterY = y + h * 0.35;
    const headRadius = w * 0.2;

    // Hair based on style
    ctx.fillStyle = style === 'hacker' ? '#333' : style === 'anime' ? '#4A3AED' : '#2D1B40';
    ctx.beginPath();
    ctx.arc(headCenterX, headCenterY - headRadius * 0.15, headRadius * 1.15, Math.PI, Math.PI * 2);
    ctx.fill();

    if (style === 'anime') {
        // Spiky hair
        for (let i = 0; i < 5; i++) {
            const angle = Math.PI + (i / 4) * Math.PI;
            ctx.beginPath();
            ctx.moveTo(headCenterX + Math.cos(angle) * headRadius * 0.8, headCenterY - headRadius * 0.15 + Math.sin(angle) * headRadius * 0.5);
            ctx.lineTo(headCenterX + Math.cos(angle) * headRadius * 1.5, headCenterY - headRadius * 1);
            ctx.lineTo(headCenterX + Math.cos(angle + 0.3) * headRadius * 0.8, headCenterY - headRadius * 0.15 + Math.sin(angle + 0.3) * headRadius * 0.5);
            ctx.fill();
        }
    }

    // Face
    ctx.fillStyle = '#F4C9A8';
    ctx.beginPath();
    ctx.arc(headCenterX, headCenterY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#2D1B40';
    ctx.beginPath();
    ctx.arc(headCenterX - headRadius * 0.35, headCenterY - headRadius * 0.05, headRadius * 0.08, 0, Math.PI * 2);
    ctx.arc(headCenterX + headRadius * 0.35, headCenterY - headRadius * 0.05, headRadius * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(headCenterX, headCenterY + headRadius * 0.15, headRadius * 0.25, 0, Math.PI);
    ctx.strokeStyle = '#2D1B40';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Style-specific accessories
    if (style === 'hacker') {
        // Hoodie
        ctx.fillStyle = '#1A1A2E';
        ctx.beginPath();
        ctx.arc(headCenterX, headCenterY - headRadius * 0.3, headRadius * 1.3, Math.PI * 0.7, Math.PI * 0.3, true);
        ctx.lineTo(headCenterX + headRadius * 1.1, bodyY);
        ctx.lineTo(headCenterX - headRadius * 1.1, bodyY);
        ctx.closePath();
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 0.9;
    } else if (style === 'student') {
        // Glasses
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(headCenterX - headRadius * 0.35, headCenterY - headRadius * 0.05, headRadius * 0.18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(headCenterX + headRadius * 0.35, headCenterY - headRadius * 0.05, headRadius * 0.18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(headCenterX - headRadius * 0.17, headCenterY - headRadius * 0.05);
        ctx.lineTo(headCenterX + headRadius * 0.17, headCenterY - headRadius * 0.05);
        ctx.stroke();
    }

    ctx.restore();
}

function drawGirlAvatar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, accent: string, style: AvatarStyle) {
    ctx.save();

    // Body
    const bodyY = y + h * 0.55;
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.9;

    // Dress shape
    ctx.beginPath();
    ctx.moveTo(x + w * 0.3, bodyY - h * 0.02);
    ctx.quadraticCurveTo(x + w / 2, bodyY + h * 0.1, x + w * 0.2, bodyY + h * 0.35);
    ctx.lineTo(x + w * 0.8, bodyY + h * 0.35);
    ctx.quadraticCurveTo(x + w / 2, bodyY + h * 0.1, x + w * 0.7, bodyY - h * 0.02);
    ctx.closePath();
    ctx.fill();

    // Head
    const headCenterX = x + w / 2;
    const headCenterY = y + h * 0.35;
    const headRadius = w * 0.2;

    // Hair
    const hairColor = style === 'anime' ? '#FF6B9D' : style === 'hacker' ? '#2D1B40' : '#5C3A1E';
    ctx.fillStyle = hairColor;

    // Long hair
    ctx.beginPath();
    ctx.ellipse(headCenterX, headCenterY, headRadius * 1.3, headRadius * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair strands
    ctx.beginPath();
    ctx.ellipse(headCenterX - headRadius * 0.8, headCenterY + headRadius * 0.5, headRadius * 0.3, headRadius * 1.2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headCenterX + headRadius * 0.8, headCenterY + headRadius * 0.5, headRadius * 0.3, headRadius * 1.2, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Face
    ctx.fillStyle = '#F4C9A8';
    ctx.beginPath();
    ctx.arc(headCenterX, headCenterY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (larger, cuter)
    ctx.fillStyle = '#2D1B40';
    ctx.beginPath();
    ctx.ellipse(headCenterX - headRadius * 0.3, headCenterY - headRadius * 0.05, headRadius * 0.1, headRadius * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headCenterX + headRadius * 0.3, headCenterY - headRadius * 0.05, headRadius * 0.1, headRadius * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(headCenterX - headRadius * 0.26, headCenterY - headRadius * 0.1, headRadius * 0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headCenterX + headRadius * 0.34, headCenterY - headRadius * 0.1, headRadius * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Blush
    ctx.fillStyle = '#FFB7C5';
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(headCenterX - headRadius * 0.45, headCenterY + headRadius * 0.15, headRadius * 0.12, headRadius * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headCenterX + headRadius * 0.45, headCenterY + headRadius * 0.15, headRadius * 0.12, headRadius * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.9;

    // Smile
    ctx.beginPath();
    ctx.arc(headCenterX, headCenterY + headRadius * 0.2, headRadius * 0.18, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = '#C97878';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hair accessory
    if (style === 'anime') {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(headCenterX + headRadius * 0.6, headCenterY - headRadius * 0.8);
        ctx.lineTo(headCenterX + headRadius * 0.8, headCenterY - headRadius * 1.1);
        ctx.lineTo(headCenterX + headRadius * 1, headCenterY - headRadius * 0.8);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

export function drawAvatar(
    ctx: CanvasRenderingContext2D,
    avatarType: AvatarType,
    avatarStyle: AvatarStyle,
    accentColor: string
) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    // Avatar zone: bottom-right, ~360×540px bounding box
    const avatarW = 360;
    const avatarH = 540;
    const avatarX = w - avatarW - 40;
    const avatarY = h - avatarH - 80;

    if (avatarType === 'boy') {
        drawBoyAvatar(ctx, avatarX, avatarY, avatarW, avatarH, accentColor, avatarStyle);
    } else {
        drawGirlAvatar(ctx, avatarX, avatarY, avatarW, avatarH, accentColor, avatarStyle);
    }
}
