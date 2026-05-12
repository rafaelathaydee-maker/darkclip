'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Bookmark, Lock, MapPin, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { panelVariants, transition, cardVariants } from '@/lib/motion'
import { ViralScore } from './ViralScore'
import { GrowthBadge } from './GrowthBadge'
import { ExplodingBadge } from './ExplodingBadge'
import { formatViews, formatDuration } from '@/lib/utils'
import { useToast } from '@/lib/toast'
import { useConversion } from '@/lib/conversion'
import { useFounder } from '@/lib/founder'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { VideoItem } from '@/types'

interface VideoCardProps {
  video: VideoItem
  locked?: boolean
  onOpen?: (video: VideoItem) => void
}

export function VideoCard({ video, locked = false, onOpen }: VideoCardProps) {
  const [hovered, setHovered] = useState(false)
  const toast = useToast()
  const { openModal } = useConversion()
  const { isPro } = useFounder()
  const { track } = useAnalytics()

  // Pro mode overrides the locked prop — all cards are accessible
  const effectiveLocked = locked && !isPro

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPro) {
      toast('Clip salvo na sua coleção ✓', 'success')
      return
    }
    toast('Create a free account to save clips', 'locked', {
      label: 'Get early access',
      onClick: () => openModal('locked_card'),
    })
  }

  const handleClick = () => {
    if (effectiveLocked) {
      track('locked_card_click', video.niche)
      openModal('locked_card')
      return
    }
    onOpen?.(video)
  }

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        'relative overflow-hidden rounded-xl',
        'w-[200px] sm:w-[220px] h-[266px] sm:h-[292px] shrink-0',
        'border border-[var(--color-border)]',
        'cursor-pointer select-none',
        'transition-[border-color,box-shadow] duration-200',
        !effectiveLocked && hovered && 'border-[var(--color-accent)]/40 shadow-[0_0_0_1px_var(--color-accent)/12%,0_8px_40px_black/50%]',
        !effectiveLocked && !hovered && 'hover:border-[var(--color-border-2)]',
        effectiveLocked && 'opacity-95'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      whileHover={effectiveLocked ? { scale: 1.01 } : { scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={transition.standard}
    >
      {/* ── Thumbnail ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={cn(
            'w-full h-full object-cover',
            'transition-[filter] duration-300',
            effectiveLocked
              ? 'brightness-[0.35] blur-[3px]'
              : hovered
              ? 'brightness-[1.05] saturate-[1.15]'
              : 'brightness-[0.95] saturate-[1.05]'
          )}
          style={
            // Ken Burns autoplay simulation on hover
            hovered && !effectiveLocked
              ? {
                  animation: 'ken-burns 8s ease-in-out infinite',
                  transformOrigin: 'center center',
                }
              : effectiveLocked
              ? { animation: 'locked-drift 12s ease-in-out infinite' }
              : {}
          }
          loading="lazy"
          draggable={false}
        />

        {/* Ambient glow overlay on hover — reactive to thumbnail */}
        {hovered && !effectiveLocked && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 100%, oklch(72% 0.28 295 / 0.08) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Bottom gradient — deeper on hover */}
      {!effectiveLocked && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: hovered
              ? 'linear-gradient(to top, oklch(4% 0.008 280 / 0.98) 0%, oklch(4% 0.008 280 / 0.7) 45%, transparent 72%)'
              : 'linear-gradient(to top, oklch(4% 0.008 280 / 0.93) 0%, oklch(4% 0.008 280 / 0.55) 40%, transparent 68%)',
          }}
        />
      )}

      {/* Fake progress bar on hover (autoplay simulation) */}
      {hovered && !effectiveLocked && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] origin-left"
            style={{ animation: `progress-play ${video.duration}s linear forwards` }}
          />
        </div>
      )}

      {/* ── LOCKED STATE ──────────────────────────────────────────── */}
      {effectiveLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* Tease: badges still visible */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
            {video.isExploding ? <ExplodingBadge /> : <span />}
            <ViralScore score={video.viralScore} />
          </div>

          {/* Glow behind lock */}
          <div
            className="absolute w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, oklch(72% 0.28 295) 0%, transparent 70%)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />

          {/* Lock icon */}
          <div className={cn(
            'relative z-10 w-9 h-9 rounded-full flex items-center justify-center',
            'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/35',
          )}>
            <Lock size={15} className="text-[var(--color-accent)]" />
          </div>

          {/* PRO ONLY — shimmer text */}
          <span
            className="relative z-10 text-[9px] font-mono font-black uppercase tracking-[0.18em]"
            style={{
              background: 'linear-gradient(90deg, oklch(72% 0.28 295 / 0.6) 0%, oklch(90% 0.15 295) 40%, oklch(100% 0 0) 50%, oklch(90% 0.15 295) 60%, oklch(72% 0.28 295 / 0.6) 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.2s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            PRO ONLY
          </span>

          {/* Blurred title tease */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-[10px] text-[var(--color-muted)] line-clamp-2 leading-snug"
               style={{ filter: 'blur(4px)', userSelect: 'none' }}>
              {video.title}
            </p>
          </div>
        </div>
      )}

      {/* ── UNLOCKED STATE ────────────────────────────────────────── */}
      {!effectiveLocked && (
        <>
          {/* Top row: exploding + score */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-10">
            {video.isExploding ? <ExplodingBadge /> : <span />}
            <ViralScore score={video.viralScore} />
          </div>

          {/* Duration */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono text-[var(--color-muted)] bg-black/55">
              {formatDuration(video.duration)}
            </span>
          </div>

          {/* FOMO velocity badge — visible when not hovering */}
          {!hovered && video.meta.velocity && (
            <div className="absolute top-[52px] left-2.5 z-10">
              <span className={cn(
                'flex items-center gap-1',
                'px-1.5 py-0.5 rounded-[3px]',
                'text-[9px] font-mono font-bold',
                'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/25'
              )}>
                <Zap size={7} className="fill-[var(--color-accent)]" />
                {video.meta.velocity}
              </span>
            </div>
          )}

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <AnimatePresence mode="wait" initial={false}>
              {hovered ? (
                <motion.div
                  key="panel"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="glass rounded-lg p-3 -mx-0.5"
                >
                  <p className="text-[12px] font-semibold text-[var(--color-text)] leading-[1.3] mb-1.5 line-clamp-2">
                    {video.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-accent)] mb-2.5 font-medium">{video.creator}</p>

                  {/* FOMO metadata row */}
                  <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                    {/* Posted ago */}
                    <span className="text-[9px] font-mono text-[var(--color-faint)] bg-[var(--color-surface-3)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                      {video.meta.postedAgo}
                    </span>
                    {/* Trending in */}
                    <span className="flex items-center gap-0.5 text-[9px] font-mono text-[var(--color-muted)] bg-[var(--color-surface-3)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                      <MapPin size={7} />
                      {video.meta.trendingIn}
                    </span>
                    {/* Badge */}
                    {video.meta.badge && (
                      <span className="text-[9px] font-mono text-[var(--color-accent)] bg-[var(--color-accent)]/8 px-1.5 py-0.5 rounded border border-[var(--color-accent)]/20">
                        {video.meta.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <GrowthBadge percent={video.growthPercent} compact />
                    <div className="flex items-center gap-1 text-[10px] text-[var(--color-muted)] font-mono ml-auto">
                      <Eye size={10} />
                      {formatViews(video.views)}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="static"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <p className="text-[12px] font-semibold text-[var(--color-text)] leading-[1.3] line-clamp-2 mb-1.5">
                    {video.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--color-muted)] truncate">{video.creator}</span>
                    <div className="ml-auto flex items-center gap-1 text-[10px] text-[var(--color-muted)] font-mono shrink-0">
                      <Eye size={9} />
                      {formatViews(video.views)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Save button — hover only */}
          <AnimatePresence>
            {hovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={transition.fast}
                className={cn(
                  'absolute z-20',
                  video.isExploding ? 'top-[46px]' : 'top-10',
                  'right-2.5',
                  'w-7 h-7 rounded-full flex items-center justify-center',
                  'bg-black/65 text-[var(--color-muted)]',
                  'hover:text-[var(--color-accent)] hover:bg-black/85',
                  'transition-colors duration-150 active:scale-[0.9]'
                )}
                onClick={handleSave}
              >
                <Bookmark size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.article>
  )
}
