'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Users, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { useConversion } from '@/lib/conversion'

// Fake live stats — rotates every 6s to simulate real-time pulse
const STAT_SETS = [
  { exploding: 23, indexed: 1247, creators: 2841, updatedMins: 4 },
  { exploding: 27, indexed: 1251, creators: 2843, updatedMins: 1 },
  { exploding: 21, indexed: 1249, creators: 2844, updatedMins: 2 },
  { exploding: 25, indexed: 1253, creators: 2847, updatedMins: 0 },
]

export function StatsBar() {
  const [idx, setIdx] = useState(0)
  const stats = STAT_SETS[idx]
  const { openModal } = useConversion()

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % STAT_SETS.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={cn(
      'border-b border-[var(--color-border)]',
      'bg-[var(--color-surface)]/60',
      'px-5 py-2',
    )}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">

        {/* Left — live indicators */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
          {/* Live signal count — pulsing accent dot */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent)]" />
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={stats.exploding}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: ease.out }}
                className="text-[12px] font-mono font-semibold text-[var(--color-accent)]"
              >
                {stats.exploding}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] text-[var(--color-faint)]">live signals</span>
          </div>

          {/* Separator */}
          <span className="hidden sm:block w-px h-3 bg-[var(--color-border)]" />

          {/* Indexed count */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <TrendingUp size={11} className="text-[var(--color-faint)]" />
            <AnimatePresence mode="wait">
              <motion.span
                key={stats.indexed}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: ease.out }}
                className="text-[12px] font-mono font-semibold text-[var(--color-muted)]"
              >
                {stats.indexed.toLocaleString()}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] text-[var(--color-faint)]">clips indexed</span>
          </div>

          {/* Separator */}
          <span className="hidden sm:block w-px h-3 bg-[var(--color-border)]" />

          {/* Updated */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent)]" />
            </span>
            <span className="text-[11px] text-[var(--color-faint)]">
              {stats.updatedMins === 0 ? 'Just updated' : `Updated ${stats.updatedMins}m ago`}
            </span>
          </div>
        </div>

        {/* Right — social proof CTA */}
        <button
          onClick={() => openModal('navbar_get_access')}
          className={cn(
            'hidden sm:flex items-center gap-1 shrink-0',
            'text-[11px] font-medium',
            'text-[var(--color-accent)]',
            'hover:underline',
            'transition-colors duration-150'
          )}
        >
          <Users size={11} />
          <span>{stats.creators.toLocaleString()} creators using DarkTrend</span>
          <ChevronRight size={11} />
        </button>
      </div>
    </div>
  )
}
