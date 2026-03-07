import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { isWhitelisted } = await import('@/lib/whitelist');
    const isUserWhitelisted = user ? await isWhitelisted(user.email) : false;
    const isNotWhitelistedPage = request.nextUrl.pathname === '/not-whitelisted';
    const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup';

    // 1. If user is authenticated but NOT whitelisted, redirect to /not-whitelisted
    // (Except if they are already on /not-whitelisted)
    if (user && !isUserWhitelisted && !isNotWhitelistedPage && !isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/not-whitelisted';
        return NextResponse.redirect(url);
    }

    // 2. Protect dashboard routes — redirect to login if not authenticated
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 3. Redirect authenticated whitelisted users away from auth pages
    if (user && isUserWhitelisted && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
