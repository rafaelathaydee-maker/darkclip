'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, TrendingUp, Eye, Download,
  Lock, ExternalLink, Copy, Clock, Tag, Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import { ViralScore } from './ViralScore'
import { GrowthBadge } from './GrowthBadge'
import { formatViews, formatDuration } from '@/lib/utils'
import { useToast } from '@/lib/toast'
import { useConversion } from '@/lib/conversion'
import { useFounder } from '@/lib/founder'
import { getDemoClipPath, downloadDemoClip, toFilename } from '@/lib/download'
import type { VideoItem } from '@/types'

interface VideoDetailDrawerProps {
  video: VideoItem | null
  onClose: () => void
}

// Fake "similar" cards — locked behind Pro
const LOCKED_SIMILAR = [
  { title: 'Bugatti Tourbillon Design...', growth: '+1,780%', score: 96 },
  { title: 'GT3 RS Onboard Nürburgring', growth: '+890%', score: 92 },
  { title: 'Rolls Royce Spectre POV', growth: '+620%', score: 88 },
]

export function VideoDetailDrawer({ video, onClose }: VideoDetailDrawerProps) {
  const toast = useToast()
  const { openModal } = useConversion()
  const { isPro } = useFounder()

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (video) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [video])

  const handleLocked = (action: 'download' | 'similar' | 'source') => {
    const sourceMap = {
      download: 'drawer_download',
      similar:  'drawer_similar',
      source:   'drawer_source',
    } as const
    openModal(sourceMap[action])
  }

  const handleDownload = () => {
    if (!video) return
    const clipPath = getDemoClipPath(video.id, video.niche)
    const filename  = toFilename(video.title)
    downloadDemoClip(clipPath, filename)
    toast(`Download iniciado — ${filename}`, 'success')
  }

  const handleViewSource = () => {
    if (!video) return
    // Open thumbnail URL as a mock "source" — replace with real link when available
    window.open(video.thumbnail.split('?')[0], '_blank', 'noopener,noreferrer')
    toast('Abrindo fonte original…', 'info')
  }

  return (
    <AnimatePresence>
      {video && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: ease.out }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-[70]',
              'w-full sm:w-[420px]',
              'bg-[var(--color-surface)]',
              'border-l border-[var(--color-border)]',
              'overflow-y-auto no-scrollbar',
              'flex flex-col',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] shrink-0">
              <span className="text-[13px] font-semibold text-[var(--color-text)]">Clip Intel</span>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-faint)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="relative w-full aspect-[3/4] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 50%)' }}
              />
              {/* Score + exploding overlaid on thumbnail */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                {video.isExploding && (
                  <span className={cn(
                    'inline-flex items-center gap-1',
                    'px-1.5 py-0.5 rounded-[4px] text-[9px] font-mono font-bold uppercase tracking-[0.14em]',
                    'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/30',
                    'animate-[signal-flicker_6s_ease-in-out_infinite]'
                  )}>
                    LIVE
                  </span>
                )}
                <span />
                <ViralScore score={video.viralScore} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-5">

              {/* Title + creator */}
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--color-text)] leading-snug mb-1.5">
                  {video.title}
                </h2>
                <p className="text-[12px] text-[var(--color-accent)] font-medium">{video.creator}</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Eye, label: 'Views', value: formatViews(video.views), color: 'text-[var(--color-text)]' },
                  { icon: TrendingUp, label: 'Growth', value: `+${video.growthPercent.toLocaleString()}%`, color: 'text-[var(--color-accent)]' },
                  { icon: Clock, label: 'Duration', value: formatDuration(video.duration), color: 'text-[var(--color-text)]' },
                ].map(stat => (
                  <div key={stat.label} className={cn(
                    'flex flex-col gap-1 p-3 rounded-xl',
                    'bg-[var(--color-surface-2)] border border-[var(--color-border)]'
                  )}>
                    <stat.icon size={12} className="text-[var(--color-faint)]" />
                    <span className={cn('text-[14px] font-mono font-semibold', stat.color)}>{stat.value}</span>
                    <span className="text-[10px] text-[var(--color-faint)]">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag size={11} className="text-[var(--color-faint)]" />
                  <span className="text-[11px] text-[var(--color-faint)] uppercase tracking-wider font-mono">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {video.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-lg text-[11px] bg-[var(--color-surface-3)] text-[var(--color-muted)] border border-[var(--color-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Format + niche */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono uppercase bg-[var(--color-surface-3)] text-[var(--color-faint)] border border-[var(--color-border)]">
                  {video.format}
                </span>
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono uppercase bg-[var(--color-surface-3)] text-[var(--color-faint)] border border-[var(--color-border)]">
                  {video.niche}
                </span>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://darktrend.co/video/${video.id}`)
                    toast('Link copied to clipboard', 'success')
                  }}
                  className={cn(
                    'flex items-center justify-center gap-2',
                    'h-10 rounded-xl text-[13px] font-medium',
                    'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                    'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-2)]',
                    'transition-all duration-150 active:scale-[0.97]'
                  )}
                >
                  <Copy size={13} />
                  Copy link
                </button>

                {isPro ? (
                  /* ── Pro: active download ── */
                  <button
                    onClick={handleDownload}
                    className={cn(
                      'flex items-center justify-center gap-2',
                      'h-10 rounded-xl text-[13px] font-medium',
                      'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/35',
                      'text-[var(--color-accent)]',
                      'hover:bg-[var(--color-accent)]/22 hover:border-[var(--color-accent)]/55',
                      'transition-all duration-150 active:scale-[0.97]',
                      'relative'
                    )}
                  >
                    <Download size={13} />
                    Download
                    <span className={cn(
                      'absolute -top-1 -right-1',
                      'px-1 rounded text-[8px] font-mono uppercase',
                      'bg-[var(--color-accent)] text-black font-bold'
                    )}>demo</span>
                  </button>
                ) : (
                  /* ── Free: locked download ── */
                  <button
                    onClick={() => handleLocked('download')}
                    className={cn(
                      'flex items-center justify-center gap-2',
                      'h-10 rounded-xl text-[13px] font-medium',
                      'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                      'text-[var(--color-faint)]',
                      'transition-all duration-150 active:scale-[0.97]',
                      'relative group'
                    )}
                  >
                    <Lock size={11} className="text-[var(--color-accent)]" />
                    Download
                    <span className={cn(
                      'absolute -top-1 -right-1',
                      'px-1 rounded text-[8px] font-mono uppercase',
                      'bg-[var(--color-accent)] text-black font-bold'
                    )}>pro</span>
                  </button>
                )}
              </div>

              {/* Separator */}
              <div className="h-px bg-[var(--color-border)]" />

              {/* Similar clips */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold text-[var(--color-text)]">Similar High-Growth Clips</span>
                  <span className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full',
                    'text-[10px] font-mono font-bold uppercase',
                    isPro
                      ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
                      : 'bg-[var(--color-accent)]/12 text-[var(--color-accent)] border border-[var(--color-accent)]/25'
                  )}>
                    {isPro ? <><Crown size={8} /> Pro ✓</> : <><Lock size={8} /> Pro</>}
                  </span>
                </div>

                {isPro ? (
                  /* ── Pro: unlocked similar clips ── */
                  <div className="flex flex-col gap-2">
                    {LOCKED_SIMILAR.map((item, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl',
                          'bg-[var(--color-surface-2)] border border-[var(--color-border)]',
                          'hover:border-[var(--color-border-2)] transition-colors duration-150',
                          'cursor-pointer'
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-3)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-[var(--color-text)] truncate">{item.title}</p>
                          <p className="text-[11px] text-[var(--color-accent)] font-mono">{item.growth}</p>
                        </div>
                        <div className="text-[11px] font-mono font-bold text-[var(--color-accent)] shrink-0">
                          {item.score}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* ── Free: blurred + lock overlay ── */
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="flex flex-col gap-2 blur-[3px] select-none pointer-events-none">
                      {LOCKED_SIMILAR.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-3)]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-[var(--color-text)] truncate">{item.title}</p>
                            <p className="text-[11px] text-[var(--color-accent)] font-mono">{item.growth}</p>
                          </div>
                          <div className="text-[11px] font-mono font-bold text-[var(--color-accent)]">{item.score}</div>
                        </div>
                      ))}
                    </div>
                    <div className={cn(
                      'absolute inset-0 flex flex-col items-center justify-center gap-3',
                      'bg-[var(--color-surface)]/60 backdrop-blur-[1px] rounded-xl',
                    )}>
                      <Lock size={18} className="text-[var(--color-accent)]" />
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-[var(--color-text)]">Criadores Pro veem isso primeiro.</p>
                        <p className="text-[11px] text-[var(--color-muted)]">Desbloqueie clips similares de alto crescimento</p>
                      </div>
                      <button
                        onClick={() => handleLocked('similar')}
                        className={cn(
                          'flex items-center gap-1.5 h-8 px-4 rounded-full',
                          'text-[12px] font-medium',
                          'bg-[var(--color-accent)] text-black',
                          'hover:brightness-110 transition-all active:scale-[0.97]'
                        )}
                      >
                        Garantir acesso
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* View source */}
              <button
                onClick={isPro ? handleViewSource : () => handleLocked('source')}
                className={cn(
                  'flex items-center justify-center gap-2 w-full',
                  'h-10 rounded-xl text-[13px]',
                  'transition-all duration-150 active:scale-[0.97]',
                  isPro
                    ? 'border border-[var(--color-border-2)] text-[var(--color-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]'
                    : 'border border-[var(--color-border)] text-[var(--color-faint)] hover:border-[var(--color-border-2)] hover:text-[var(--color-muted)]'
                )}
              >
                <ExternalLink size={13} />
                View source
                {!isPro && <Lock size={10} className="text-[var(--color-accent)]" />}
              </button>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
