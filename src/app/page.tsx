'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Palette, Download, Flame, Zap, Sparkles, Star, LogIn, UserPlus } from 'lucide-react';

const features = [
  { icon: Upload, title: 'Upload Schedule', desc: 'Drop your Excel or CSV study plan', color: '#7C3AED' },
  { icon: Palette, title: '5 Beautiful Themes', desc: 'Dark, Neon, Anime, Minimal, Hacker', color: '#00FF9F' },
  { icon: Download, title: 'Instant Download', desc: '1080×1920 wallpaper in seconds', color: '#FF6B9D' },
  { icon: Flame, title: 'Daily Streaks', desc: 'Stay motivated with XP & streaks', color: '#F59E0B' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[var(--background)]/60 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#00FF9F] flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">LearnWall</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </motion.button>
          </Link>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--primary)] text-sm font-semibold text-white hover:bg-[var(--primary-hover)] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00FF9F]/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B9D]/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-xs font-medium text-[var(--accent)]">Daily Learning Wallpaper Generator</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Turn your study plan into{' '}
            <span className="gradient-text">stunning wallpapers</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--muted)] mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Upload your Excel schedule, pick a theme, and get a personalized motivational wallpaper for your phone — every single day.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--primary)] text-white text-base font-bold hover:bg-[var(--primary-hover)] transition-colors animate-pulse-glow"
              >
                <Sparkles className="w-5 h-5" />
                Generate My Wallpaper
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/dashboard/upload">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 text-white text-base font-medium hover:bg-white/10 border border-white/10 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Schedule
              </motion.button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-2"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-xs text-[var(--muted)]">Loved by self-learners worldwide</span>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-[var(--muted)]">From spreadsheet to wallpaper in under 2 minutes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-2xl p-6 group hover:border-white/10 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: `${feature.color}15` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-[var(--muted)]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes showcase */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">5 Stunning Themes</h2>
          <p className="text-[var(--muted)] mb-12">Each theme transforms your wallpaper with unique particles, fonts, and vibes</p>

          <div className="flex flex-wrap justify-center gap-4">
            {([
              { name: 'Dark', colors: ['#0F0C29', '#302B63', '#24243E'], accent: '#7C3AED' },
              { name: 'Neon', colors: ['#000000', '#0D0221'], accent: '#00FF9F' },
              { name: 'Anime', colors: ['#FFF0F5', '#E8D5F5'], accent: '#FF6B9D' },
              { name: 'Minimal', colors: ['#F8F9FA', '#F0F1F3'], accent: '#1A1A2E' },
              { name: 'Hacker', colors: ['#0D1117', '#161B22'], accent: '#00FF41' },
            ] as const).map((theme, idx) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="w-32 h-56 rounded-2xl overflow-hidden border border-white/10"
                style={{ background: `linear-gradient(to bottom, ${theme.colors.join(', ')})` }}
              >
                <div className="h-full flex flex-col items-center justify-end p-3">
                  <div className="w-8 h-8 rounded-full mb-2" style={{ background: theme.accent, opacity: 0.8 }} />
                  <span className="text-xs font-bold" style={{ color: theme.accent }}>{theme.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-3xl p-10 border border-[var(--primary)]/20 glow-primary">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to level up your learning?
            </h2>
            <p className="text-[var(--muted)] mb-8">
              Upload your schedule and get your first wallpaper in under 2 minutes. Free forever.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 mx-auto px-8 py-4 rounded-2xl bg-[var(--primary)] text-white text-base font-bold hover:bg-[var(--primary-hover)] transition-colors animate-pulse-glow"
              >
                <Zap className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} LearnWall — Made with ❤️ for learners everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
