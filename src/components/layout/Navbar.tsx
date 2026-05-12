'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navbarVariants, transition } from '@/lib/motion'
import { useConversion } from '@/lib/conversion'
import { useFounder } from '@/lib/founder'
import { useAnalytics } from '@/hooks/useAnalytics'

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { openModal } = useConversion()
  const { isPro, hydrated, openSignIn } = useFounder()
  const { track } = useAnalytics()

  return (
    <motion.header
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-14',
        'glass',
        'border-b border-[var(--color-border)]'
      )}
    >
      <div className="h-full max-w-[1400px] mx-auto px-5 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 group">
          <span className={cn(
            'relative flex items-center justify-center',
            'w-6 h-6 rounded-md',
            'bg-[var(--color-accent)]/15',
            'border border-[var(--color-accent)]/30',
            'transition-all duration-200',
            'group-hover:bg-[var(--color-accent)]/25 group-hover:border-[var(--color-accent)]/50'
          )}>
            <Zap
              size={13}
              className="text-[var(--color-accent)] fill-[var(--color-accent)]"
            />
          </span>
          <span className={cn(
            'font-semibold text-[15px] tracking-[-0.02em]',
            'text-[var(--color-text)]',
            'transition-colors duration-200',
            'group-hover:text-white'
          )}>
            Dark<span className="text-[var(--color-accent)]">Trend</span>
          </span>
        </a>

        {/* Search — expands on click */}
        <div className="flex-1 flex justify-center max-w-sm mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            {searchOpen ? (
              <motion.div
                key="search-open"
                initial={{ opacity: 0, width: '160px' }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: '160px' }}
                transition={transition.standard}
                className={cn(
                  'flex items-center gap-2',
                  'h-8 px-3 rounded-lg',
                  'bg-[var(--color-surface-2)]',
                  'border border-[var(--color-border-2)]',
                  'focus-within:border-[var(--color-accent)]/50',
                  'transition-colors duration-150'
                )}
              >
                <Search size={13} className="text-[var(--color-faint)] shrink-0" />
                <input
                  autoFocus
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Search niches, creators…"
                  className={cn(
                    'flex-1 bg-transparent outline-none',
                    'text-[13px] text-[var(--color-text)]',
                    'placeholder:text-[var(--color-faint)]'
                  )}
                  onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchValue('') }}
                  className="text-[var(--color-faint)] hover:text-[var(--color-muted)] transition-colors"
                >
                  <X size={13} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'flex items-center gap-2',
                  'h-8 px-3 rounded-lg',
                  'bg-[var(--color-surface)]/50',
                  'border border-[var(--color-border)]',
                  'text-[var(--color-faint)] text-[13px]',
                  'hover:text-[var(--color-muted)] hover:border-[var(--color-border-2)]',
                  'transition-all duration-150',
                  'active:scale-[0.97]'
                )}
              >
                <Search size={13} />
                <span className="hidden sm:inline">Search…</span>
                <kbd className={cn(
                  'hidden sm:inline-flex items-center',
                  'h-4 px-1 rounded',
                  'bg-[var(--color-surface-3)]',
                  'text-[10px] font-mono text-[var(--color-faint)]',
                  'border border-[var(--color-border)]'
                )}>⌘K</kbd>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Right: CTA / Pro badge — render nothing until localStorage is read (avoids hydration flash) */}
        <div className="flex items-center gap-3 shrink-0">
          {!hydrated ? (
            /* Placeholder while hydrating — same width as "Get Access" to prevent layout shift */
            <div className="h-8 w-[100px] rounded-lg bg-[var(--color-surface-2)] animate-pulse" />
          ) : isPro ? (
            /* ── Founder Pro state ─────────────────────────── */
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  'flex items-center gap-1.5',
                  'h-7 px-3 rounded-full',
                  'text-[11px] font-semibold font-mono uppercase tracking-wider',
                  'bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
                  'border border-[var(--color-accent)]/35',
                  'shadow-[0_0_12px_var(--color-accent)/15%]',
                )}
              >
                <Crown size={10} className="fill-[var(--color-accent)]" />
                Founder Pro
              </motion.div>
            </div>
          ) : (
            /* ── Free state ────────────────────────────────── */
            <>
              <button
                onClick={openSignIn}
                className={cn(
                  'hidden sm:flex items-center',
                  'text-[13px] text-[var(--color-muted)]',
                  'hover:text-[var(--color-text)]',
                  'transition-colors duration-150'
                )}
              >
                Sign in
              </button>
              <button
                onClick={() => { track('get_access_click', 'navbar'); openModal('navbar_get_access') }}
                className={cn(
                  'flex items-center gap-1.5',
                  'h-8 px-4 rounded-lg',
                  'text-[13px] font-medium',
                  'text-[var(--color-accent)]',
                  'bg-[var(--color-accent)]/10',
                  'border border-[var(--color-accent)]/30',
                  'hover:bg-[var(--color-accent)]/18 hover:border-[var(--color-accent)]/50',
                  'shadow-[0_0_12px_var(--color-accent)/10%]',
                  'transition-all duration-150',
                  'active:scale-[0.97]'
                )}
              >
                Get Access
              </button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
