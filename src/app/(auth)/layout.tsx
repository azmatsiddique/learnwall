import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Left panel — decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#7C3AED]/15 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#00FF9F]/10 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B9D]/5 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 text-center px-12 max-w-lg">
                    <Link href="/" className="inline-flex items-center gap-3 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#00FF9F] flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                    </Link>

                    <h1 className="text-4xl font-black text-white mb-4 leading-tight">
                        Your daily study{' '}
                        <span className="gradient-text">wallpaper</span>{' '}
                        awaits
                    </h1>
                    <p className="text-base text-[var(--muted)] leading-relaxed">
                        Upload your schedule, pick a theme, and stay motivated with a personalized wallpaper — every single day.
                    </p>

                    {/* Floating theme cards */}
                    <div className="mt-12 flex justify-center gap-3">
                        {[
                            { bg: 'linear-gradient(135deg, #0F0C29, #302B63)', label: 'Dark' },
                            { bg: 'linear-gradient(135deg, #000, #0D0221)', label: 'Neon' },
                            { bg: 'linear-gradient(135deg, #FFF0F5, #E8D5F5)', label: 'Anime' },
                            { bg: 'linear-gradient(135deg, #0D1117, #161B22)', label: 'Hacker' },
                        ].map((t, i) => (
                            <div
                                key={t.label}
                                className="w-14 h-24 rounded-xl border border-white/10 animate-float"
                                style={{
                                    background: t.bg,
                                    animationDelay: `${i * 0.8}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                {children}
            </div>
        </div>
    );
}
