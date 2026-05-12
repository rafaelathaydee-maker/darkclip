'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Search, TrendingUp, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { useConversion } from '@/lib/conversion'
import { useAnalytics } from '@/hooks/useAnalytics'

// Floating metric cards — positioned absolutely in the right half
const METRICS = [
  { label: '+5,200%', sub: 'fastest growth',    pos: 'top-[18%] right-[22%]', delay: '0s',   anim: 'float-slow' },
  { label: 'VS 99',   sub: 'viral score',        pos: 'top-[42%] right-[10%]', delay: '1.2s', anim: 'float-slow-2' },
  { label: '23 LIVE', sub: 'signals active',     pos: 'top-[8%]  right-[8%]',  delay: '0.7s', anim: 'float-slow-3' },
  { label: 'LOW COMP', sub: 'competition in BR', pos: 'top-[64%] right-[19%]', delay: '2s',   anim: 'float-slow' },
]

// Counter that slowly animates up
function LiveCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(target - 3)
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => {
        if (c >= target) { clearInterval(id); return target }
        return c + 1
      })
    }, 1200)
    return () => clearInterval(id)
  }, [target])
  return <span className="font-mono tabular-nums">{count.toLocaleString()}{suffix}</span>
}

export function Hero() {
  const { openModal } = useConversion()
  const { track } = useAnalytics()

  const handleCTA = () => {
    track('get_access_click', 'hero')
    openModal('navbar_get_access')
  }

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      {/* ── Background ──────────────────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.30]"
          style={{
            backgroundImage: [
              'linear-gradient(oklch(30% 0.015 280 / 0.35) 1px, transparent 1px)',
              'linear-gradient(90deg, oklch(30% 0.015 280 / 0.35) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '44px 44px',
          }}
        />

        {/* Violet spotlight — left, single accent only */}
        <div
          className="absolute -left-[10%] top-[-20%] w-[55%] h-[140%] opacity-[0.10]"
          style={{ background: 'radial-gradient(ellipse 55% 70% at 30% 50%, oklch(72% 0.28 295) 0%, transparent 70%)' }}
        />

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, oklch(72% 0.28 295 / 0.4) 30%, oklch(72% 0.28 295 / 0.7) 50%, oklch(72% 0.28 295 / 0.4) 70%, transparent 100%)',
            animation: 'scan-line 9s linear infinite',
          }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to top, var(--color-bg), transparent)' }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 py-12 sm:py-16">
        <div className="max-w-[620px]">

          {/* For-who badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: ease.out }}
            className="flex items-center gap-2 mb-5"
          >
            <span className={cn(
              'px-2.5 py-1 rounded-sm',
              'text-[10px] font-mono uppercase tracking-[0.12em]',
              'bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/20 text-[var(--color-accent)]'
            )}>
              Para criadores de páginas anônimas
            </span>
          </motion.div>

          {/* Live pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.04 }}
            className="flex items-center gap-2.5 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Live intelligence feed
            </span>
            <span className="h-3 w-px bg-[var(--color-border)]" />
            <span className="text-[10px] font-mono text-[var(--color-faint)]">
              <LiveCounter target={1247} /> clips indexed
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: ease.out, delay: 0.08 }}
            className={cn(
              'text-[30px] sm:text-[42px] md:text-[50px]',
              'font-bold tracking-[-0.03em] leading-[1.08]',
              'text-[var(--color-text)]',
              'mb-5'
            )}
          >
            Find viral clips to repost<br />
            <span className="text-[var(--color-accent)]">
              before everyone else.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.14 }}
            className="text-[14px] sm:text-[15px] text-[var(--color-muted)] leading-relaxed mb-7 max-w-[480px]"
          >
            DarkTrend monitors 10 niches and ranks clips by viral potential.
            Stop spending hours searching — see what&apos;s about to explode and post it first.
          </motion.p>

          {/* How it works — 3-step row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.18 }}
            className="flex items-center gap-2 mb-7 flex-wrap"
          >
            {[
              { Icon: Search,     step: '1. We index'       },
              { Icon: TrendingUp, step: '2. We rank by niche' },
              { Icon: Share2,     step: '3. You post first' },
            ].map(({ Icon, step }, i) => (
              <div key={step} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[var(--color-border)] text-[10px] mx-0.5">→</span>}
                <Icon size={11} className="text-[var(--color-muted)]" />
                <span className="text-[10px] font-mono text-[var(--color-muted)]">{step}</span>
              </div>
            ))}
          </motion.div>

          {/* Stat chips — single accent color */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.22 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {[
              '23 live signals',
              '+5,200% fastest growth',
              '10 niches tracked',
              'low comp in BR & MX',
            ].map(label => (
              <span
                key={label}
                className={cn(
                  'px-2.5 py-1 rounded-sm',
                  'text-[10px] font-mono uppercase tracking-[0.08em]',
                  'border',
                  'bg-[var(--color-accent)]/8 text-[var(--color-accent)]/80 border-[var(--color-accent)]/18'
                )}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: ease.out, delay: 0.28 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <button
              onClick={handleCTA}
              className={cn(
                'flex items-center gap-2',
                'h-11 px-6 rounded-lg',
                'text-[13px] font-semibold text-black',
                'transition-all duration-150 active:scale-[0.97] hover:brightness-110',
              )}
              style={{
                background: 'linear-gradient(105deg, oklch(70% 0.28 295) 0%, oklch(76% 0.26 302) 100%)',
                boxShadow: '0 0 20px oklch(72% 0.28 295 / 0.25)',
              }}
            >
              <Zap size={14} className="fill-black" />
              Get Early Access — Free
              <ArrowRight size={14} />
            </button>

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-[var(--color-faint)]">
                Sem cartão de crédito. Cancele quando quiser.
              </span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Floating metric cards ────────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none hidden lg:block">
        {METRICS.map(m => (
          <div
            key={m.label}
            className={cn('absolute', m.pos)}
            style={{ animation: `${m.anim} ${m.anim === 'float-slow' ? '5s' : m.anim === 'float-slow-2' ? '6s' : '4.5s'} ease-in-out infinite`, animationDelay: m.delay }}
          >
            <div className={cn(
              'flex flex-col gap-0.5',
              'px-3 py-2.5 rounded-lg',
              'glass border border-[var(--color-accent)]/18',
              'shadow-lg',
              'min-w-[100px]',
            )}>
              <span className="text-[15px] font-bold font-mono leading-none text-[var(--color-accent)]">{m.label}</span>
              <span className="text-[9px] text-[var(--color-faint)] uppercase tracking-[0.1em]">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
