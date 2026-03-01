import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Match dashboard and auth routes, skip static files and API
        '/((?!_next/static|_next/image|favicon.ico|api/wallpaper|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
