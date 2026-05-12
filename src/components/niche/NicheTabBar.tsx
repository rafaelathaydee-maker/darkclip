'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NICHES } from '@/lib/mock-data'
import type { NicheId } from '@/types'

interface NicheTabBarProps {
  active: NicheId
  onChange: (id: NicheId) => void
}

export function NicheTabBar({ active, onChange }: NicheTabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn(
        'sticky z-40',
        'top-14', // sticks just below fixed 56px navbar
        'glass',
        'border-b border-[var(--color-border)]'
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          'flex items-center gap-1',
          'overflow-x-auto no-scrollbar',
          'px-5 py-2',
          'max-w-[1400px] mx-auto'
        )}
      >
        {NICHES.map((niche) => {
          const isActive = niche.id === active

          return (
            <button
              key={niche.id}
              onClick={() => onChange(niche.id)}
              className={cn(
                'relative flex items-center gap-1.5',
                'h-8 px-3 rounded-sm',
                'text-[11px] font-medium whitespace-nowrap tracking-[0.02em]',
                'transition-colors duration-150',
                'active:scale-[0.96]',
                'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50',
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              )}
            >
              {/* Active pill background — shared layout animation */}
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className={cn(
                    'absolute inset-0 rounded-sm',
                    'bg-[var(--color-accent)]/10',
                    'border border-[var(--color-accent)]/30'
                  )}
                  transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                />
              )}

              <span className="relative z-10">{niche.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
