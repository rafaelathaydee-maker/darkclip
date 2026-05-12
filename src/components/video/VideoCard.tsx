'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Bookmark, Lock, MapPin, Zap, Info } from 'lucide-react'
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
import { getYouTubeId } from '@/types'
import type { VideoItem } from '@/types'

interface VideoCardProps {
  video: VideoItem
  locked?: boolean
  onOpen?: (video: VideoItem) => void
}

/** Delay before showing the YouTube embed preview on hover (ms) */
const EMBED_DELAY_MS = 900

export function VideoCard({ video, locked = false, onOpen }: VideoCardProps) {
  const [hovered, setHovered]         = useState(false)
  const [showEmbed, setShowEmbed]     = useState(false)
  const [embedReady, setEmbedReady]   = useState(false)
  const embedTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toast                         = useToast()
  const { openModal }                 = useConversion()
  const { isPro }                     = useFounder()
  const { track }                     = useAnalytics()

  const effectiveLocked = locked && !isPro
  const ytId            = getYouTubeId(video)

  // Build embed URL for hover preview
  const embedSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&rel=0&modestbranding=1&playsinline=1`
    : null

  const handleMouseEnter = () => {
    setHovered(true)
    if (embedSrc && !effectiveLocked) {
      embedTimer.current = setTimeout(() => setShowEmbed(true), EMBED_DELAY_MS)
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setShowEmbed(false)
    setEmbedReady(false)
    if (embedTimer.current) {
      clearTimeout(embedTimer.current)
      embedTimer.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (embedTimer.current) clearTimeout(embedTimer.current)
    }
  }, [])

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

  // Opens the drawer (details panel)
  const handleOpenDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOpen?.(video)
  }

  // Primary card click:
  //   • Locked  → conversion modal
  //   • Real YT → open YouTube Short in new tab
  //   • Mock    → open details drawer (fallback)
  const handleClick = () => {
    if (effectiveLocked) {
      track('locked_card_click', video.niche)
      openModal('locked_card')
      return
    }
    if (ytId) {
      window.open(`https://www.youtube.com/shorts/${ytId}`, '_blank', 'noopener,noreferrer')
      return
    }
    // Mock / demo item — fall back to drawer
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={effectiveLocked ? { scale: 1.01 } : { scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={transition.standard}
    >
      {/* ── Thumbnail / Embed layer ───────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden bg-[var(--color-surface-3)]">
        {/* Static thumbnail — always rendered, fades out when embed loads */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={cn(
            'absolute inset-0 w-full h-full object-cover',
            'transition-[filter,opacity] duration-300',
            effectiveLocked
              ? 'brightness-[0.35] blur-[3px]'
              : hovered && !embedReady
              ? 'brightness-[1.05] saturate-[1.15]'
              : hovered && embedReady
              ? 'opacity-0'
              : 'brightness-[0.95] saturate-[1.05]'
          )}
          style={
            hovered && !effectiveLocked && !embedReady
              ? { animation: 'ken-burns 8s ease-in-out infinite', transformOrigin: 'center center' }
              : effectiveLocked
              ? { animation: 'locked-drift 12s ease-in-out infinite' }
              : {}
          }
          loading="lazy"
          draggable={false}
        />

        {/* YouTube embed preview — mounts after EMBED_DELAY_MS on hover */}
        {showEmbed && embedSrc && (
          <iframe
            key={ytId}
            src={embedSrc}
            title={video.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
            onLoad={() => setEmbedReady(true)}
            className={cn(
              // Cover card width, let height overflow vertically (cropped by overflow-hidden)
              // Card is ~3:4; Short is 9:16. Width=100%, height=100%*16/9*(4/3) ≈ 138% → crops top/bottom
              'absolute left-0 w-full pointer-events-none',
              'transition-opacity duration-400',
              embedReady ? 'opacity-100' : 'opacity-0',
            )}
            style={{
              height: 'calc(100% * 16 / 9 * 4 / 3)',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
            }}
          />
        )}

        {/* Loading pulse — visible between timer fire and embed ready */}
        {showEmbed && !embedReady && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[3px]">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-[3px] h-[3px] rounded-full bg-[var(--color-accent)]/60"
                  style={{ animation: `pulse 1s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ambient glow on hover */}
        {hovered && !effectiveLocked && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 100%, oklch(72% 0.28 295 / 0.08) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Bottom gradient — hides when embed is playing */}
      {!effectiveLocked && !embedReady && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: hovered
              ? 'linear-gradient(to top, oklch(4% 0.008 280 / 0.98) 0%, oklch(4% 0.008 280 / 0.7) 45%, transparent 72%)'
              : 'linear-gradient(to top, oklch(4% 0.008 280 / 0.93) 0%, oklch(4% 0.008 280 / 0.55) 40%, transparent 68%)',
          }}
        />
      )}

      {/* Progress bar — thumbnail state only */}
      {hovered && !effectiveLocked && !showEmbed && (
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
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
            {video.isExploding ? <ExplodingBadge /> : <span />}
            <ViralScore score={video.viralScore} />
          </div>
          <div
            className="absolute w-24 h-24 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, oklch(72% 0.28 295) 0%, transparent 70%)', animation: 'pulse-glow 2s ease-in-out infinite' }}
          />
          <div className={cn(
            'relative z-10 w-9 h-9 rounded-full flex items-center justify-center',
            'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/35',
          )}>
            <Lock size={15} className="text-[var(--color-accent)]" />
          </div>
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

          {/* Duration chip — hidden when embed is playing */}
          {!embedReady && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono text-[var(--color-muted)] bg-black/55">
                {formatDuration(video.duration)}
              </span>
            </div>
          )}

          {/* FOMO velocity badge */}
          {!hovered && video.meta.velocity && (
            <div className="absolute top-[52px] left-2.5 z-10">
              <span className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded-[3px]',
                'text-[9px] font-mono font-bold',
                'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/25'
              )}>
                <Zap size={7} className="fill-[var(--color-accent)]" />
                {video.meta.velocity}
              </span>
            </div>
          )}

          {/* Bottom content — hidden when embed takes over */}
          {!embedReady && (
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
                    <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                      <span className="text-[9px] font-mono text-[var(--color-faint)] bg-[var(--color-surface-3)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                        {video.meta.postedAgo}
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] font-mono text-[var(--color-muted)] bg-[var(--color-surface-3)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                        <MapPin size={7} />
                        {video.meta.trendingIn}
                      </span>
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
          )}

          {/* Action buttons on hover — save + details */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
                className={cn(
                  'absolute z-20 flex flex-col gap-1.5',
                  video.isExploding ? 'top-[46px]' : 'top-10',
                  'right-2.5',
                )}
              >
                {/* Save */}
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...transition.fast, delay: 0 }}
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    'bg-black/65 text-[var(--color-muted)]',
                    'hover:text-[var(--color-accent)] hover:bg-black/85',
                    'transition-colors duration-150 active:scale-[0.9]'
                  )}
                  onClick={handleSave}
                >
                  <Bookmark size={13} />
                </motion.button>

                {/* Details / intel panel */}
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...transition.fast, delay: 0.05 }}
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    'bg-black/65 text-[var(--color-muted)]',
                    'hover:text-[var(--color-accent)] hover:bg-black/85',
                    'transition-colors duration-150 active:scale-[0.9]'
                  )}
                  onClick={handleOpenDetails}
                  title="Open clip intel"
                >
                  <Info size={13} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* "Watch on YouTube" hint — only visible when embed is playing */}
          {embedReady && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <span className="px-2 py-0.5 rounded-full text-[8px] font-mono text-[var(--color-faint)] bg-black/70 tracking-wider uppercase">
                youtube shorts
              </span>
            </div>
          )}
        </>
      )}
    </motion.article>
  )
}
