const WHITELIST_URL = 'https://docs.google.com/spreadsheets/d/1Ci50WRrxGz6sI-JV-64Vt_Prph8rtDSaUB8vUvYL9kc/export?format=csv';

interface WhitelistCache {
    emails: Set<string>;
    expiresAt: number;
}

let cache: WhitelistCache | null = null;
const CACHE_TTL = 1 * 60 * 1000; // Reduced to 1 minute for better testing experience

export async function getWhitelistedEmails(forceRefresh = false): Promise<Set<string>> {
    const now = Date.now();

    if (!forceRefresh && cache && cache.expiresAt > now) {
        return cache.emails;
    }

    try {
        console.log(`[Whitelist] ${forceRefresh ? 'Force refreshing' : 'Refreshing'} from Google Sheet...`);
        const response = await fetch(WHITELIST_URL, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch whitelist: ${response.statusText}`);
        }

        const csv = await response.text();
        const emails = new Set(
            csv.split(/\r?\n/)
                .map(line => line.trim().replace(/^["'](.+)["']$/, '$1').toLowerCase())
                .filter(email => email && email !== 'email' && email.includes('@'))
        );

        console.log(`[Whitelist] Fetched ${emails.size} emails`);

        cache = {
            emails,
            expiresAt: now + CACHE_TTL,
        };

        return emails;
    } catch (error) {
        console.error('Error fetching whitelist:', error);
        return cache?.emails || new Set();
    }
}

export async function isWhitelisted(email: string | undefined): Promise<boolean> {
    if (!email) {
        console.log('[Whitelist] Access denied: No email provided');
        return false;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check current cache first (super fast)
    let whitelistedEmails = await getWhitelistedEmails(false);
    if (whitelistedEmails.has(normalizedEmail)) {
        console.log(`[Whitelist] Cache Hit: "${normalizedEmail}" ✅`);
        return true;
    }

    // 2. If NOT in cache, maybe it's a NEW student? 
    // Force a fresh fetch from the Google Sheet right now.
    console.log(`[Whitelist] "${normalizedEmail}" not in cache. Checking LATEST Google Sheet...`);
    whitelistedEmails = await getWhitelistedEmails(true);

    const result = whitelistedEmails.has(normalizedEmail);
    console.log(`[Whitelist] Final Result for "${normalizedEmail}": ${result ? '✅ ALLOWED' : '❌ DENIED'}`);

    return result;
}
