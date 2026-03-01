'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, User, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const PASSWORD_RULES = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreed, setAgreed] = useState(false);

    const passwordStrength = PASSWORD_RULES.filter(r => r.test(password)).length;
    const strengthPercent = (passwordStrength / PASSWORD_RULES.length) * 100;
    const strengthColor =
        strengthPercent <= 33 ? 'bg-red-500' :
            strengthPercent <= 66 ? 'bg-yellow-500' : 'bg-green-500';

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (passwordStrength < PASSWORD_RULES.length) {
            setError('Please meet all password requirements');
            return;
        }
        if (!agreed) {
            setError('Please agree to the Terms of Service');
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                setIsLoading(false);
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch {
            setError('An unexpected error occurred');
            setIsLoading(false);
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#00FF9F] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">LearnWall</h2>
                    <p className="text-[10px] text-[var(--muted)] tracking-wider uppercase">Daily Wallpaper</p>
                </div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
                <p className="text-sm text-[var(--muted)]">
                    Start generating personalized learning wallpapers
                </p>
            </div>



            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                        Full name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="signup-email" className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                        Email address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="signup-password" className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                        <input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Create a password"
                            className="w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Password strength */}
                    {password && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2.5 space-y-2"
                        >
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${strengthPercent}%` }}
                                    className={`h-full rounded-full transition-colors ${strengthColor}`}
                                />
                            </div>
                            <div className="space-y-1">
                                {PASSWORD_RULES.map(rule => {
                                    const passed = rule.test(password);
                                    return (
                                        <div key={rule.label} className="flex items-center gap-2">
                                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passed ? 'bg-green-500/20' : 'bg-white/5'
                                                }`}>
                                                {passed && <Check className="w-2.5 h-2.5 text-green-400" />}
                                            </div>
                                            <span className={`text-[11px] ${passed ? 'text-green-400' : 'text-[var(--muted)]'}`}>
                                                {rule.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                        onClick={() => setAgreed(!agreed)}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${agreed
                            ? 'bg-[var(--primary)] border-[var(--primary)]'
                            : 'border-[var(--border)] group-hover:border-white/30'
                            }`}
                    >
                        {agreed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs text-[var(--muted)] leading-relaxed">
                        I agree to the{' '}
                        <button type="button" className="text-[var(--primary)] hover:underline">Terms of Service</button>
                        {' '}and{' '}
                        <button type="button" className="text-[var(--primary)] hover:underline">Privacy Policy</button>
                    </span>
                </label>

                {/* Error */}
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg"
                    >
                        {error}
                    </motion.p>
                )}

                {/* Submit */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60 glow-primary"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-sm text-[var(--muted)]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--primary)] font-medium hover:text-[var(--accent)] transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
