import Link from 'next/link';

export default function NotWhitelistedPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-25"></div>
                    <div className="relative bg-[#111111] rounded-full p-6 inline-flex border border-red-900/50">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Access Restricted</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Your account is not currently on the whitelist for LearnWall.
                    </p>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-2xl">
                    <p className="text-sm text-gray-500 mb-6 italic">
                        "Access to this portal is limited to authorized students and staff only."
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="bg-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Return to Login
                        </Link>
                        <p className="text-xs text-gray-600 mt-2">
                            If you believe this is an error, please contact your administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
