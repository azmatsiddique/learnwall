'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallpaperStore } from '@/store/wallpaperStore';
import {
    Smartphone,
    Apple,
    Copy,
    Check,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Download,
    Clock,
    Settings,
    Zap,
    Shield,
    Sparkles,
} from 'lucide-react';

type Platform = 'android' | 'ios';

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[var(--muted)] hover:bg-white/10 hover:text-white transition-all"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                </>
            )}
        </button>
    );
}

function StepCard({
    number,
    title,
    children,
}: {
    number: number;
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: number * 0.1 }}
            className="glass rounded-2xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[var(--primary)]">{number}</span>
                </div>
                <h3 className="text-sm font-semibold text-white flex-1">{title}</h3>
                {open ? (
                    <ChevronUp className="w-4 h-4 text-[var(--muted)]" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--muted)]" />
                )}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0 space-y-3 text-sm text-[var(--muted)] leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const PHONE_MODELS = [
    {
        group: 'iPhone', models: [
            { id: 'iphone-13-mini', label: 'iPhone 13 mini', res: '1080×2340' },
            { id: 'iphone-13', label: 'iPhone 13 / 13 Pro', res: '1170×2532' },
            { id: 'iphone-13-pro-max', label: 'iPhone 13 Pro Max', res: '1284×2778' },
            { id: 'iphone-14', label: 'iPhone 14 / 14 Pro', res: '1170×2532' },
            { id: 'iphone-14-plus', label: 'iPhone 14 Plus', res: '1284×2778' },
            { id: 'iphone-14-pro-max', label: 'iPhone 14 Pro Max', res: '1290×2796' },
            { id: 'iphone-15', label: 'iPhone 15 / 15 Pro', res: '1179×2556' },
            { id: 'iphone-15-plus', label: 'iPhone 15 Plus / Pro Max', res: '1290×2796' },
            { id: 'iphone-16', label: 'iPhone 16', res: '1179×2556' },
            { id: 'iphone-16-pro', label: 'iPhone 16 Pro', res: '1206×2622' },
            { id: 'iphone-16-pro-max', label: 'iPhone 16 Pro Max', res: '1320×2868' },
        ]
    },
    {
        group: 'Samsung', models: [
            { id: 'samsung-s24', label: 'Galaxy S24', res: '1080×2340' },
            { id: 'samsung-s24-plus', label: 'Galaxy S24+', res: '1440×3120' },
            { id: 'samsung-s24-ultra', label: 'Galaxy S24 Ultra', res: '1440×3120' },
            { id: 'samsung-a54', label: 'Galaxy A54', res: '1080×2340' },
        ]
    },
    {
        group: 'Pixel', models: [
            { id: 'pixel-8', label: 'Pixel 8', res: '1080×2400' },
            { id: 'pixel-8-pro', label: 'Pixel 8 Pro', res: '1344×2992' },
        ]
    },
    {
        group: 'Generic', models: [
            { id: 'generic-hd', label: 'Generic HD', res: '1080×1920' },
            { id: 'generic-fhd', label: 'Generic FHD+', res: '1080×2400' },
        ]
    },
];

export default function AutoSetupPage() {
    const [platform, setPlatform] = useState<Platform>('android');
    const [phoneModel, setPhoneModel] = useState('iphone-14');
    const { theme, avatarType, avatarStyle } = useWallpaperStore();
    const [mounted, setMounted] = useState(false);
    const [uid, setUid] = useState('default');
    const [baseUrl, setBaseUrl] = useState('https://yoursite.com/api/wallpaper/daily');

    useEffect(() => {
        setMounted(true);
        setBaseUrl(`${window.location.origin}/api/wallpaper/daily`);
        try {
            const s = JSON.parse(localStorage.getItem('learnwall-user') || '{}');
            if (s?.state?.uid) setUid(s.state.uid);
        } catch { /* ignore */ }
    }, []);

    const selectedModel = PHONE_MODELS
        .flatMap(g => g.models)
        .find(m => m.id === phoneModel);

    const wallpaperUrl = `${baseUrl}?uid=${uid}&model=${phoneModel}&theme=${theme}&avatar=${avatarType}&style=${avatarStyle}`;

    if (!mounted) {
        return <div className="space-y-6 flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        </div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                    <h1 className="text-2xl font-bold text-white">Auto Wallpaper Setup</h1>
                </div>
                <p className="text-sm text-[var(--muted)]">
                    Automatically change your phone wallpaper every day with your learning schedule
                </p>
            </motion.div>

            {/* Current Preferences Info */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 flex items-center gap-3 border border-[var(--primary)]/20"
            >
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-[var(--muted)]">Your wallpaper preferences · User ID: <span className="text-white font-mono">{uid}</span></p>
                    <p className="text-sm text-white mt-0.5">
                        Theme: <span className="text-[var(--primary)] font-medium capitalize">{theme}</span>
                        {' · '}Avatar: <span className="text-[var(--primary)] font-medium capitalize">{avatarType}</span>
                        {' · '}Style: <span className="text-[var(--primary)] font-medium capitalize">{avatarStyle}</span>
                    </p>
                </div>
            </motion.div>

            {/* Step 1 — Phone Model */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="glass rounded-2xl p-5"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-[var(--primary)]">1</span>
                    </div>
                    <h2 className="text-sm font-semibold text-white">Select Your Phone</h2>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">Phone Model</label>
                        <div className="relative">
                            <select
                                value={phoneModel}
                                onChange={e => setPhoneModel(e.target.value)}
                                className="w-full appearance-none px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all cursor-pointer"
                            >
                                {PHONE_MODELS.map(group => (
                                    <optgroup key={group.group} label={group.group}>
                                        {group.models.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.label} ({m.res})
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                        </div>
                    </div>

                    {selectedModel && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                            <Smartphone className="w-4 h-4 text-[var(--primary)]" />
                            <span className="text-xs text-[var(--primary)] font-medium">
                                {selectedModel.label} — {selectedModel.res}px wallpaper
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* How it works */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="glass rounded-2xl p-5"
            >
                <h2 className="text-sm font-semibold text-white mb-3">How it works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { icon: Clock, label: 'Daily trigger', desc: 'Runs at your chosen time (e.g. 6:00 AM)' },
                        { icon: Download, label: 'Fetch wallpaper', desc: "Downloads today's generated wallpaper" },
                        { icon: Smartphone, label: 'Auto-set', desc: 'Sets it as your lock/home screen' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03]">
                            <item.icon className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-white">{item.label}</p>
                                <p className="text-[11px] text-[var(--muted)]">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Platform toggle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2"
            >
                <button
                    onClick={() => setPlatform('android')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${platform === 'android'
                        ? 'border-green-500/40 bg-green-500/10 text-green-400'
                        : 'border-[var(--border)] bg-[var(--surface)]/50 text-[var(--muted)] hover:border-white/20'
                        }`}
                >
                    <Smartphone className="w-4 h-4" />
                    Android
                </button>
                <button
                    onClick={() => setPlatform('ios')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${platform === 'ios'
                        ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                        : 'border-[var(--border)] bg-[var(--surface)]/50 text-[var(--muted)] hover:border-white/20'
                        }`}
                >
                    <Apple className="w-4 h-4" />
                    iOS
                </button>
            </motion.div>

            {/* Your Wallpaper URL */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass rounded-2xl p-5"
            >
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-white">Your Wallpaper URL</h2>
                    <CopyButton text={wallpaperUrl} />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-black/30 border border-white/10 font-mono text-xs text-[var(--accent)] overflow-x-auto">
                    {wallpaperUrl}
                </div>
                <p className="text-[11px] text-[var(--muted)] mt-2">
                    This URL is customized for your <strong className="text-white">{selectedModel?.label || 'phone'}</strong>. Use it in the automation steps below.
                </p>
            </motion.div>

            {/* Android Steps */}
            <AnimatePresence mode="wait">
                {platform === 'android' ? (
                    <motion.div
                        key="android"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-3"
                    >
                        <StepCard number={1} title="Install MacroDroid">
                            <p>
                                Download{' '}
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                                >
                                    MacroDroid <ExternalLink className="w-3 h-3" />
                                </a>{' '}
                                from Google Play Store. It&apos;s free and allows you to create automated tasks.
                            </p>
                        </StepCard>

                        <StepCard number={2} title="Create a New Macro">
                            <p>
                                Open <strong className="text-white">MacroDroid</strong> → tap{' '}
                                <strong className="text-white">Add Macro</strong>
                            </p>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-white">Trigger:</p>
                                <div className="px-3 py-2 rounded-lg bg-white/5 text-xs">
                                    <p>
                                        <strong className="text-yellow-400">Date/Time</strong> → <strong className="text-white">Day/Time</strong> →
                                        Set time to <strong className="text-white">06:00</strong> →
                                        Activate <strong className="text-white">all weekdays</strong>
                                    </p>
                                </div>
                            </div>
                        </StepCard>

                        <StepCard number={3} title="Configure Actions">
                            <div className="space-y-4">
                                {/* Action 4.1 */}
                                <div>
                                    <p className="text-xs font-semibold text-white mb-2">
                                        3.1 — Download Image
                                    </p>
                                    <ul className="space-y-1.5 text-xs list-none">
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Go to <strong className="text-white">Web Interactions</strong> → <strong className="text-white">HTTP Request</strong></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Request method: <strong className="text-white">GET</strong></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Paste the URL below:</span>
                                        </li>
                                    </ul>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 font-mono text-[11px] text-[var(--accent)] overflow-x-auto">
                                            {wallpaperUrl}
                                        </div>
                                        <CopyButton text={wallpaperUrl} />
                                    </div>
                                    <ul className="space-y-1.5 text-xs list-none mt-3">
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Enable: <strong className="text-white">Block next actions until complete</strong></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Response Tick: <strong className="text-white">Save HTTP response to file</strong></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Folder &amp; Filename: <strong className="text-white">/Download/learnwall.png</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Action 4.2 */}
                                <div>
                                    <p className="text-xs font-semibold text-white mb-2">
                                        3.2 — Set Wallpaper
                                    </p>
                                    <ul className="space-y-1.5 text-xs list-none">
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Go to <strong className="text-white">Device Settings</strong> → <strong className="text-white">Set Wallpaper</strong></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Choose <strong className="text-white">Image and Screen</strong></span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-[var(--muted)]">•</span>
                                            <span>Enter folder &amp; filename: <strong className="text-white">/Download/learnwall.png</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Important note */}
                                <div className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                    <p className="text-xs text-yellow-400 font-medium">
                                        ⚠️ Important: Use the exact same folder and filename in both actions.
                                    </p>
                                </div>
                            </div>
                        </StepCard>

                        <StepCard number={4} title="Finalize">
                            <p>
                                Give the macro a name → Tap <strong className="text-white">Create Macro</strong>
                            </p>
                        </StepCard>

                        <StepCard number={5} title="Testing & Managing">
                            <div className="space-y-2 text-xs">
                                <p>
                                    <strong className="text-yellow-400">Test:</strong> MacroDroid → Macros → select your macro →
                                    More options → <strong className="text-white">Test macro</strong>
                                </p>
                                <p>
                                    <strong className="text-yellow-400">Stop:</strong> Toggle off or delete the macro
                                </p>
                                <p>
                                    <strong className="text-yellow-400">Edit URL:</strong> Tap the HTTP Request action →
                                    Update the URL → Save
                                </p>
                            </div>
                        </StepCard>
                    </motion.div>
                ) : (
                    <motion.div
                        key="ios"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                    >
                        <StepCard number={1} title="Open Shortcuts App">
                            <p>
                                Open the built-in <strong className="text-white">Shortcuts</strong> app on your iPhone
                                (comes pre-installed with iOS 13+).
                            </p>
                        </StepCard>

                        <StepCard number={2} title="Create Automation">
                            <div className="space-y-2 text-xs">
                                <p>
                                    Go to <strong className="text-white">Automation</strong> tab →{' '}
                                    <strong className="text-white">New Automation</strong>
                                </p>
                                <div className="px-3 py-2 rounded-lg bg-white/5">
                                    <p>
                                        Select <strong className="text-yellow-400">Time of Day</strong> →{' '}
                                        <strong className="text-white">6:00 AM</strong> → Repeat{' '}
                                        <strong className="text-yellow-400">&quot;Daily&quot;</strong> → Select{' '}
                                        <strong className="text-white">&quot;Run Immediately&quot;</strong> →{' '}
                                        <strong className="text-white">&quot;Create New Shortcut&quot;</strong>
                                    </p>
                                </div>
                            </div>
                        </StepCard>

                        <StepCard number={3} title="Create Shortcut">
                            <div className="space-y-4">
                                <p className="text-xs font-semibold text-white">ADD THESE ACTIONS:</p>

                                {/* Step 3.1 */}
                                <div>
                                    <p className="text-xs mb-2">
                                        3.1 — <strong className="text-white">&quot;Get Contents of URL&quot;</strong> → paste the following URL there:
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 font-mono text-[11px] text-[var(--accent)] overflow-x-auto">
                                            {wallpaperUrl}
                                        </div>
                                        <CopyButton text={wallpaperUrl} />
                                    </div>
                                </div>

                                {/* Step 3.2 */}
                                <div>
                                    <p className="text-xs">
                                        3.2 — <strong className="text-white">&quot;Set Wallpaper Photo&quot;</strong> → choose{' '}
                                        <strong className="text-white">&quot;Lock Screen&quot;</strong>
                                    </p>
                                </div>

                                {/* Important */}
                                <div className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                    <p className="text-xs text-yellow-400 font-medium mb-1">
                                        ⚠️ Important:
                                    </p>
                                    <p className="text-[11px] text-yellow-300/80">
                                        In &quot;Set Wallpaper Photo&quot;, tap the arrow (→) to show options →
                                        disable both <strong className="text-white">&quot;Crop to Subject&quot;</strong> and{' '}
                                        <strong className="text-white">&quot;Show Preview&quot;</strong>.
                                    </p>
                                    <p className="text-[11px] text-[var(--muted)] mt-1">
                                        This prevents iOS from cropping and asking for confirmation each time.
                                    </p>
                                </div>
                            </div>
                        </StepCard>

                        <StepCard number={4} title="Testing & Managing">
                            <div className="space-y-2 text-xs">
                                <p>
                                    <strong className="text-yellow-400">Test:</strong> Open Shortcuts → tap your shortcut → Run
                                </p>
                                <p>
                                    <strong className="text-yellow-400">Stop:</strong> Go to Automation tab → swipe left to delete
                                </p>
                                <p>
                                    <strong className="text-yellow-400">Edit URL:</strong> Open the shortcut → tap the URL action → update
                                </p>
                            </div>
                        </StepCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tip */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-5"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-[var(--accent)]" />
                    <h3 className="text-sm font-semibold text-white">Pro Tips</h3>
                </div>
                <ul className="space-y-2 text-xs text-[var(--muted)]">
                    <li className="flex gap-2">
                        <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                        <span>Set the trigger time to <strong className="text-white">before you wake up</strong> so the wallpaper is ready when you check your phone.</span>
                    </li>
                    <li className="flex gap-2">
                        <Settings className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                        <span>Make sure to <strong className="text-white">keep your schedule uploaded</strong> — the wallpaper updates based on your latest data.</span>
                    </li>
                    <li className="flex gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                        <span>Works on both <strong className="text-white">lock screen</strong> and <strong className="text-white">home screen</strong> — choose whichever you prefer.</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}
